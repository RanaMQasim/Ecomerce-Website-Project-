import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";

import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";

const ProductDisplay = ({ product: propProduct }) => {
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(ShopContext);

  useEffect(() => {
    setProduct(propProduct);
  }, [propProduct]);

  if (!product) return null; // or a loading spinner

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
        </div>
        <div className="productdisplay-right-size">
          <h2>Select Size</h2>
          <div className="productdisplay-size-options">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
          </div>
        </div>
        <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
      </div>
    </div>
  );
};

export default ProductDisplay;
