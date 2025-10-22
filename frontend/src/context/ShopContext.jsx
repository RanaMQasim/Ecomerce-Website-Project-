import React, { createContext, useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/products";

export const ShopContext = createContext(null);
const resolveProductId = (maybe) => {
  if (!maybe && maybe !== 0) return "";
  if (typeof maybe === "string" || typeof maybe === "number") return String(maybe);
  if (typeof maybe === "object") {
    return String(maybe._id ?? maybe.id ?? maybe.product ?? "");
  }
  return String(maybe);
};
const itemsArrayToObject = (items = []) => {
  const out = {};
  for (const it of items) {
    const id = resolveProductId(it.product);
    if (!id) continue;
    out[id] = (out[id] || 0) + (Number(it.quantity) || 0);
  }
  return out;
};

const calcSubtotalFromItems = (items = []) =>
  items.reduce((acc, it) => {
    const qty = Number(it.quantity) || 0;
    const unit = (it.discountPrice != null && it.discountPrice < it.price)
      ? it.discountPrice
      : it.price;
    return acc + (Number(unit || 0) * qty);
  }, 0);

const ShopContextProvider = (props) => {
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

  const addToCart = (product, qty = 1) => {
    setFallbackCart(prev => {
      const id = resolveProductId(product);
      const next = { ...prev };
      const prod = typeof product === "object"
        ? {
            _id: product._id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice ?? null,
            images: product.images,
          }
        : products.find(p => String(p._id) === String(product));
      next[id] = {
        ...(next[id] || prod),
        quantity: (next[id]?.quantity || 0) + qty,
      };
      localStorage.setItem("fallback_cart_v1", JSON.stringify(next));
      return next;
    });
  };

  const removeFromCart = (id) => {
    setFallbackCart(prev => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem("fallback_cart_v1", JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    setFallbackCart({});
    localStorage.removeItem("fallback_cart_v1");
  };

  const allCartItems = useMemo(() => Object.values(fallbackCart), [fallbackCart]);

  const contextValue = {
    all_product: products,
    loadingProducts,
    errorProducts,
    allCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount: () => calcSubtotalFromItems(allCartItems),
    getTotalCartItems: () =>
      allCartItems.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0),
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;