import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/products";
import api from "../services/api";
import { AuthContext } from "../store/AuthContext"; 

export const ShopContext = createContext(null);
const resolveProductId = (maybe) => {
  if (!maybe && maybe !== 0) return "";
  if (typeof maybe === "string" || typeof maybe === "number") return String(maybe);
  if (typeof maybe === "object") {
    return String(maybe._id ?? maybe.id ?? maybe.product ?? "");
  }
  return String(maybe);
};

const calcSubtotalFromItems = (items = []) =>
  items.reduce((acc, it) => {
    const qty = Number(it.quantity) || 0;
    const unit = (it.discountPrice != null && it.discountPrice < it.price)
      ? it.discountPrice
      : it.price;
    return acc + (Number(unit || 0) * qty);
  }, 0);
const normalizeServerItem = (si) => {
  const productObj = si.product && typeof si.product === "object" ? si.product : { _id: String(si.product) };
  const productId = String(productObj._id ?? productObj.id ?? si.product ?? "");
  return {
    _id: productId,
    product: productId,
    name: si.name ?? productObj.name ?? "",
    images: si.images && si.images.length ? si.images : (productObj.images ?? []),
    quantity: Number(si.quantity || 0),
    price: Number(si.price || 0),
    discountPrice: si.discountPrice != null ? Number(si.discountPrice) : null,
    selectedSize: si.selectedSize ?? ""
  };
};
const ShopContextProvider = (props) => {
  const auth = useContext(AuthContext); 
  const isLoggedIn = !!(auth && auth.token);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [fallbackCart, setFallbackCart] = useState(() => {
    try {
      const raw = localStorage.getItem("fallback_cart_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [serverCartItems, setServerCartItems] = useState([]);
  const [loadingServerCart, setLoadingServerCart] = useState(false);
  useEffect(() => {
    let mounted = true;
    setLoadingProducts(true);
    getProducts({ limit: 100 })
      .then((data) => {
        if (!mounted) return;
        const payload = data?.data ?? data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.products ?? payload?.items ?? payload;
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        if (!mounted) return;
        setErrorProducts("Failed to load products");
        setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoadingProducts(false);
      });
    return () => { mounted = false; };
  }, []);
  const fetchUserCart = async () => {
    if (!isLoggedIn) return;
    setLoadingServerCart(true);
    try {
      const res = await api.get("/api/cart");
      const cart = res?.data?.cart || { items: [] };
      const items = Array.isArray(cart.items) ? cart.items.map(normalizeServerItem) : [];
      setServerCartItems(items);
    } catch (err) {
      console.error("Failed to fetch user cart:", err);
    } finally {
      setLoadingServerCart(false);
    }
  };
  const mergeLocalToServer = async () => {
    if (!isLoggedIn) return;
    const guestItemsObj = fallbackCart || {};
    const guestEntries = Object.values(guestItemsObj);
    if (!guestEntries || guestEntries.length === 0) return;
    const payloadItems = guestEntries.map((g) => ({
      productId: resolveProductId(g.product ?? g._id ?? g),
      quantity: Number(g.quantity || 1),
      selectedSize: g.selectedSize ?? "",
      price: Number(g.price ?? g.originalPrice ?? g.old_price ?? 0),
      discountPrice: g.discountPrice != null ? Number(g.discountPrice) : (g.discount_price ?? g.new_price ?? null)
    })).filter(it => it.productId);

    if (payloadItems.length === 0) return;

    try {
      await api.post("/api/cart/merge", { items: payloadItems });
      await fetchUserCart();
      setFallbackCart({});
      localStorage.removeItem("fallback_cart_v1");
    } catch (err) {
      console.error("Failed to merge local cart to server:", err);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserCart().then(() => {
        mergeLocalToServer().catch((e) => {
          console.error("mergeLocalToServer error:", e);
        });
      });
    } else {
      setServerCartItems([]);
    }
  }, [isLoggedIn]); 
  const addToCart = async (product, qty = 1, selectedSize = "") => {
    const id = resolveProductId(product);
    if (!id) {
      console.warn("addToCart: invalid product id", product);
      return;
    }

    if (isLoggedIn) {
      try {
        await api.post("/api/cart/item", {
          productId: id,
          quantity: Number(qty || 1),
          selectedSize: selectedSize || "",
          price: Number(product.price ?? product.originalPrice ?? 0),
          discountPrice: product.discountPrice != null ? Number(product.discountPrice) : null
        });
        await fetchUserCart();
      } catch (err) {
        console.error("Error adding to server cart:", err);
        setFallbackCart(prev => {
          const next = { ...prev };
          const prod = typeof product === "object" ? product : { _id: id };
          next[id] = {
            ...(next[id] || prod),
            quantity: (next[id]?.quantity || 0) + Number(qty || 1),
            selectedSize: selectedSize || (next[id]?.selectedSize || "")
          };
          localStorage.setItem("fallback_cart_v1", JSON.stringify(next));
          return next;
        });
      }
    } else {
      setFallbackCart(prev => {
        const next = { ...prev };
        const prod = typeof product === "object"
          ? {
              _id: product._id,
              name: product.name,
              price: product.price,
              discountPrice: product.discountPrice ?? null,
              images: product.images,
              selectedSize: product.selectedSize ?? ""
            }
          : { _id: id };
        next[id] = {
          ...(next[id] || prod),
          quantity: (next[id]?.quantity || 0) + Number(qty || 1),
          selectedSize: selectedSize || (next[id]?.selectedSize || "")
        };
        localStorage.setItem("fallback_cart_v1", JSON.stringify(next));
        return next;
      });
    }
  };

  const removeFromCart = async (productIdOrId, selectedSize = "") => {
    const id = resolveProductId(productIdOrId);
    if (!id) return;

    if (isLoggedIn) {
      try {
        await api.delete("/api/cart/item", { data: { productId: id, selectedSize: selectedSize || "" } });
        await fetchUserCart();
      } catch (err) {
        console.error("Error removing from server cart:", err);
      }
    } else {
      setFallbackCart(prev => {
        const next = { ...prev };
        delete next[id];
        localStorage.setItem("fallback_cart_v1", JSON.stringify(next));
        return next;
      });
    }
  };

  const updateCartItemQuantity = async (productIdOrId, quantity = 1, selectedSize = "") => {
    const id = resolveProductId(productIdOrId);
    if (!id) return;

    const qty = Math.max(0, Math.min(100, Number(quantity || 0)));

    if (isLoggedIn) {
      try {
       
        await api.put("/api/cart/item", { productId: id, selectedSize: selectedSize || "", quantity: qty });
        await fetchUserCart();
      } catch (err) {
        console.error("Error updating server cart item:", err);
      }
    } else {
      setFallbackCart(prev => {
        const next = { ...prev };
        if (!next[id]) return prev;
        if (qty <= 0) {
          delete next[id];
        } else {
          next[id] = { ...next[id], quantity: qty };
        }
        localStorage.setItem("fallback_cart_v1", JSON.stringify(next));
        return next;
      });
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await api.post("/api/cart/clear");
        setServerCartItems([]);
      } catch (err) {
        console.error("Error clearing server cart:", err);
      }
    } else {
      setFallbackCart({});
      localStorage.removeItem("fallback_cart_v1");
    }
  };

  const allCartItems = useMemo(() => {
    return isLoggedIn ? serverCartItems : Object.values(fallbackCart);
  }, [isLoggedIn, serverCartItems, fallbackCart]);

  const getTotalCartAmount = () => calcSubtotalFromItems(allCartItems);
  const getTotalCartItems = () => allCartItems.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);

 
  const contextValue = {
    all_product: products,
    loadingProducts,
    errorProducts,
    allCartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    fetchUserCart, 
    loadingServerCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
