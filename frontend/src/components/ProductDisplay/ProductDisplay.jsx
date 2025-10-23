import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";

let useCart;
try {
  useCart = require("../../hooks/useCart").default;
} catch (err) {
  useCart = null;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function toAbsoluteUrl(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return API_BASE + s;
  if (s.startsWith("images/") || s.startsWith("upload/") || s.startsWith("upload\\")) {
    return `${API_BASE}/${s}`;
  }
  return `${API_BASE}/images/${s}`;
}

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

const ProductDisplay = ({ product: propProduct }) => {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const shopCtx = useContext(ShopContext);
  const fallbackAddToCart = shopCtx?.addToCart ?? ((id) => {
    console.warn("Fallback addToCart called for id:", id);
  });

  const cartHook = useCart ? useCart() : null;
  const addToCart = cartHook?.addToCart ?? fallbackAddToCart;

  useEffect(() => {
    if (!propProduct) {
      setProduct(null);
      setMainImage("");
      return;
    }

    const rawImages =
      propProduct.images ??
      (propProduct.image ? [{ url: propProduct.image, alt: propProduct.name }] : []);

    const images = Array.isArray(rawImages)
      ? rawImages
          .map((img) => {
            const urlField = img?.url ?? img;
            return {
              url: toAbsoluteUrl(urlField),
              alt: img?.alt ?? propProduct.name ?? "",
            };
          })
          .filter((i) => i.url)
      : [];

    const normalized = {
      ...propProduct,
      _id: propProduct._id ?? propProduct.id ?? propProduct.productId,
      images,
      price: Number(
        propProduct.discountPrice ??
          propProduct.discount_price ??
          propProduct.new_price ??
          propProduct.price ??
          0
      ),
      originalPrice: Number(
        propProduct.price ??
          propProduct.old_price ??
          propProduct.originalPrice ??
          0
      ),
      size:
        Array.isArray(propProduct.size) && propProduct.size.length
          ? propProduct.size
          : DEFAULT_SIZES,
    };

    setProduct(normalized);
    setMainImage(images?.[0]?.url || normalized.image || "");
    setSelectedSize(normalized.size[0]);
    setQuantity(1);
  }, [propProduct]);

  if (!product) return null;

  const isDiscounted =
    product.originalPrice && product.price && product.price < product.originalPrice;

  const onAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const snapshot = {
      _id: product._id,
      product: product._id,
      name: product.name,
      price: product.originalPrice || product.price,
      discountPrice: isDiscounted ? product.price : null,
      images: product.images,
      size: selectedSize, 
      quantity,
    };

    addToCart(snapshot, quantity, selectedSize);
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {product.images && product.images.length ? (
            product.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.alt || product.name}
                className={`thumb ${mainImage === img.url ? "active" : ""}`}
                onClick={() => setMainImage(img.url)}
                loading="lazy"
              />
            ))
          ) : (
            <img src="/placeholder.png" alt="placeholder" className="thumb" />
          )}
        </div>

        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={mainImage || "/placeholder.png"}
            alt={product.name}
            loading="eager"
          />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>

        <div className="productdisplay-right-star" aria-hidden>
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
        </div>

        <div className="productdisplay-price">
          <div className="price-current">
            $
            {(
              isDiscounted
                ? product.price
                : product.price || product.originalPrice
            ).toFixed(2)}
          </div>
          {isDiscounted && (
            <div className="price-old">${product.originalPrice.toFixed(2)}</div>
          )}
        </div>

        <div className="productdisplay-right-size">
          <h2>Select Size</h2>
          <div className="productdisplay-size-options">
            {product.size.map((s) => (
              <button
                key={s}
                className={`size-option ${
                  selectedSize === s ? "selected" : ""
                }`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="productdisplay-quantity">
          <label htmlFor="qty">Quantity</label>
          <div className="qty-controls">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease"
            >
              -
            </button>
            <input
              id="qty"
              type="number"
              value={quantity}
              min={1}
              max={100}
              onChange={(e) => {
                const v = Number(e.target.value) || 1;
                setQuantity(Math.max(1, Math.min(100, v)));
              }}
            />
            <button
              onClick={() => setQuantity((q) => Math.min(100, q + 1))}
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>

        <div className="productdisplay-actions">
          <button className="add-to-cart-btn" onClick={onAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
