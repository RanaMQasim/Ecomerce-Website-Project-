import React, { useContext } from "react";
import "./Navbar.css";
import { NavLink, Link, useNavigate } from "react-router-dom";

import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from "../../context/ShopContext";
import useCart from "../../hooks/useCart";
import { AuthContext } from "../../store/AuthContext";

const Navbar = () => {
  const shopCtx = useContext(ShopContext);
  const fallbackGetTotal = shopCtx?.getTotalCartItems ?? (() => 0);

  let cartHook;
  try {
    cartHook = useCart();
  } catch {
    cartHook = null;
  }

  const cartItems = cartHook?.items ?? null;
  const cartCount = cartItems
    ? cartItems.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0)
    : fallbackGetTotal();

  const { token, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("auth-token");
    }
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-logo">
        <Link to="/" aria-label="Home">
          <img src={logo} alt="Forever logo" />
        </Link>
        <p>FOREVER</p>
      </div>

      <nav>
        <ul className="nav-menu">
          <li><NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>Shop</NavLink></li>
          <li><NavLink to="/mens" className={({ isActive }) => (isActive ? "active-link" : "")}>Men</NavLink></li>
          <li><NavLink to="/womens" className={({ isActive }) => (isActive ? "active-link" : "")}>Women</NavLink></li>
          <li><NavLink to="/kids" className={({ isActive }) => (isActive ? "active-link" : "")}>Kids</NavLink></li>
        </ul>
      </nav>

      <div className="nav-login-cart">
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart" className="nav-cart-link" aria-label="Cart">
          <div className="cart-icon-wrapper">
            <img src={cart_icon} alt="Cart" className="cart-icon" />
            {cartCount > 0 && (
              <span className="nav-cart-count">{cartCount}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
