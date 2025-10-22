import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrum from "../components/Breadcrums/Breadcrum";
import { ShopContext } from "../context/ShopContext";
import ProductDisplay from "../components/ProductDisplay/ProductDisplay";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const findInContext = () => {
      if (!all_product || !productId) return null;
      return all_product.find((p) => {
        const idA = p._id ?? p.id ?? p._id?.$oid; 
        return String(idA) === String(productId);
      });
    };

    const fetchFromServer = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/products/${productId}`);
        if (res.data) {
          if (res.data.product) return res.data.product;
          if (res.data.products && res.data.products.length) return res.data.products[0];
          if (res.data._id || res.data.id) return res.data;
        }
        return null;
      } catch (err) {
        console.warn("Failed to fetch product from server:", err.response?.data || err.message);
        return null;
      }
    };
      const load = async () => {
      setLoading(true);
      const ctx = findInContext();
      if (mounted && ctx) {
        setProduct(ctx);
        setLoading(false);
        return;
      }
      const fetched = await fetchFromServer();
      if (mounted && fetched) {
        setProduct(fetched);
        setLoading(false);
        return;
      }
      if (mounted) {
        setProduct(null);
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [all_product, productId]);

  if (loading) {
    return (
      <div className="product-loading">
        <h2>Loading product details...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <p>We couldn't find the product you requested.</p>
      </div>
    );
  }

  return (
    <div className="product-page">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
    </div>
  );
};
export default Product;