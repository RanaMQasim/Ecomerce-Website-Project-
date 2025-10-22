import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";

const Breadcrum = ({ product }) => {
  return (
    <nav className="breadcrum" aria-label="breadcrumb">
      <span className="crumb">Home</span>
      <img src={arrow_icon} alt="breadcrumb arrow" />
      <span className="crumb">Shop</span>
      {product?.category && (
        <>
          <img src={arrow_icon} alt="breadcrumb arrow" />
          <span className="crumb">{product.category}</span>
        </>
      )}
      {product?.name && (
        <>
          <img src={arrow_icon} alt="breadcrumb arrow" />
          <span className="crumb active">{product.name}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrum;
