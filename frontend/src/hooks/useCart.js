import { useState, useEffect, useCallback, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../store/AuthContext";

const LOCAL_KEY = "app_cart_v1";

export default function useCart() {
  const auth = useContext(AuthContext);
  const user = auth?.user || null;
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const persistLocal = (next) => {
    setItems(next);
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    } catch {}
  };
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const localRaw = localStorage.getItem(LOCAL_KEY);
        const localItems = localRaw ? JSON.parse(localRaw) : [];
        if (localItems.length > 0) {
          await api.post("/api/cart/merge", { items: localItems });
          localStorage.removeItem(LOCAL_KEY);
        }
        const res = await api.get("/api/cart"); 
        if (!mounted) return;
        setItems(res.data.items || []);
      } catch (err) {
        console.error("Cart load error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  const addToCart = useCallback(async (productSnapshot, qty = 1, selectedSize = "") => {
    const newItem = {
      product: productSnapshot._id || productSnapshot.product,
      price: productSnapshot.price ?? productSnapshot.new_price ?? 0,
      discountPrice: productSnapshot.discountPrice ?? productSnapshot.discount_price ?? null,
      quantity: qty,
      selectedSize,
      name: productSnapshot.name,
      images: productSnapshot.images || productSnapshot.image ? [{ url: productSnapshot.image }] : []
    };

    if (user) {
      const res = await api.post("/api/cart/item", newItem);
      setItems(res.data.items || []);
    } else {
      setItems(prev => {
        const idx = prev.findIndex(it => it.product === newItem.product && it.selectedSize === newItem.selectedSize);
        let next;
        if (idx > -1) {
          next = [...prev];
          next[idx].quantity = Math.min(100, next[idx].quantity + qty);
        } else {
          next = [...prev, newItem];
        }
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
    }
  }, [user]);

  const updateQty = useCallback(async (productId, selectedSize, newQty) => {
    if (user) {
      const res = await api.put("/api/cart/item", { product: productId, selectedSize, quantity: newQty }); 
      setItems(res.data.items || []);
    } else {
      setItems(prev => {
        const next = prev.map(it => (it.product === productId && it.selectedSize === selectedSize) ? { ...it, quantity: newQty } : it);
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
    }
  }, [user]);

  const removeItem = useCallback(async (productId, selectedSize) => {
    if (user) {
      const res = await api.delete("/api/cart/item", { data: { product: productId, selectedSize } }); 
      setItems(res.data.items || []);
    } else {
      setItems(prev => {
        const next = prev.filter(it => !(it.product === productId && it.selectedSize === selectedSize));
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
    }
  }, [user]);

  const clearCart = useCallback(async () => {
    if (user) {
      await api.post("/api/cart/clear");
      setItems([]);
    } else {
      localStorage.removeItem(LOCAL_KEY);
      setItems([]);
    }
  }, [user]);

  return { items, loading, addToCart, updateQty, removeItem, clearCart };
}
