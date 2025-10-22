import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";
import { getPopularProducts } from "../../services/api";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPopularProducts();

        console.debug("getPopularProducts result:", result);

        const products =
          result?.data?.products ??
          result?.products ??
          result?.data ??
          result ??
          [];

        const normalized = Array.isArray(products)
          ? products
          : products?.items ?? [];
          
        const womenProducts = (Array.isArray(normalized) ? normalized : []).filter(
          (item) =>
            item.category &&
            item.category.toLowerCase().includes("women")
        );

        setPopularProducts(womenProducts.slice(0, 6));
      } catch (err) {
        console.error("Error fetching popular products:", err);
        setError("Failed to load popular products.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  if (loading) {
    return (
      <div className="popular loading">
        <h1>Popular In Women</h1>
        <p>Loading popular products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popular error">
        <h1>Popular In Women</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!popularProducts.length) {
    return (
      <div className="popular no-data">
        <h1>Popular In Women</h1>
        <p>No popular products found. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="popular">
      <h1>Popular In Women</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, index) => (
          <Item key={item._id ?? item.id ?? index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Popular;
