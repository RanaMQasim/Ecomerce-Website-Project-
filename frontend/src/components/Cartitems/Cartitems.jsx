import React, { useContext } from "react";
import "./Cartitems.css";
import { ShopContext } from "../../context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const Cartitems = () => {
  const {
    allCartItems = [],
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const handleIncrease = (id) => {
    const item = allCartItems.find((p) => p._id === id);
    if (item) {
      const newQty = item.quantity + 1;
      updateCartItemQuantity
        ? updateCartItemQuantity(id, newQty)
        : localStorage.setItem(
            "fallback_cart_v1",
            JSON.stringify({ [id]: { ...item, quantity: newQty } })
          );
    }
  };

  const handleDecrease = (id) => {
    const item = allCartItems.find((p) => p._id === id);
    if (item && item.quantity > 1) {
      const newQty = item.quantity - 1;
      updateCartItemQuantity
        ? updateCartItemQuantity(id, newQty)
        : localStorage.setItem(
            "fallback_cart_v1",
            JSON.stringify({ [id]: { ...item, quantity: newQty } })
          );
    }
  };

  const subtotal = getTotalCartAmount?.() || 0;

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>

      <hr />

      {allCartItems.length > 0 ? (
        allCartItems.map((item, index) => {
          const price = Number(item.discountPrice ?? item.price ?? 0);
          const qty = Number(item.quantity ?? 0);
          const total = price * qty;

          return (
            <div key={index}>
              <div className="cartitems-format">
                <img
                  src={item.images?.[0]?.url || item.image || "/placeholder.png"}
                  alt={item.name}
                  className="carticon-product-icon"
                />
                <p>{item.name}</p>
                <p>${price.toFixed(2)}</p>

                <div className="cartitems-quantity">
                  <button onClick={() => handleDecrease(item._id)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => handleIncrease(item._id)}>+</button>
                </div>

                <p>${total.toFixed(2)}</p>

                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(item._id)}
                  alt="remove"
                />
              </div>
              <hr />
            </div>
          );
        })
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty 🛒</p>
          <p style={{ fontSize: "14px", color: "#777" }}>
            Start adding items to your cart!
          </p>
        </div>
      )}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Summary</h1>

          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <h3>Total</h3>
            <h3>${subtotal.toFixed(2)}</h3>
          </div>

          <button className="checkout-btn">PROCEED TO CHECKOUT</button>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cartitems;
