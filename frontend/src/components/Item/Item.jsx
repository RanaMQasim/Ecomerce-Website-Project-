import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";
let useCart;
try {
  useCart = require("../../hooks/useCart").default;
} catch (err) {
  useCart = null;
}

const Item = ({ item }) => {
  const id = item._id || item.id;
  const name = item.name || item.title || "Product";
  const imageUrl = (item.images && item.images[0] && item.images[0].url) || item.image || "/placeholder.png";
  const price = Number(item.discountPrice ?? item.discount_price ?? item.new_price ?? item.price ?? 0);
  const originalPrice = Number(item.price ?? item.old_price ?? item.original_price ?? 0);
  const isDiscounted = originalPrice && price && price < originalPrice;

  const cart = useCart ? useCart() : null;
  const addToCart = cart?.addToCart ?? (() => {
    console.warn("Add to cart attempted, but useCart hook not found.");
  });

  return (
    <div className="item">
      <Link to={`/product/${id}`} aria-label={`View ${name}`}>
        <img src={imageUrl} alt={name} loading="lazy" className="item-image" />
      </Link>

      <p className="item-name">{name}</p>

      <div className="item-prices">
        <div className="item-price-new">
          ${price.toFixed(2)}
        </div>

        {isDiscounted && (
          <div className="item-price-old" aria-hidden>
            ${originalPrice.toFixed(2)}
          </div>
        )}
      </div>

      <div className="item-actions">
        <button
          className="btn-add-to-cart"
          onClick={() => addToCart(item, 1, item.size?.[0] || "")}
          aria-label={`Add ${name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Item;