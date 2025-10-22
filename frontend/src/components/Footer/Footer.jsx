import React from "react";
import "./Footer.css";
import footer_logo from "../Assets/logo_big.png";
import instagram_icon from "../Assets/instagram_icon.png";
import pinterest_icon from "../Assets/pintester_icon.png";
import whatsapp_icon from "../Assets/whatsapp_icon.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={footer_logo} alt="Forever brand logo" />
        <p className="footer-brand">FOREVER</p>
      </div>
      <ul className="footer-links">
        <li><a href="/company">Company</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/offices">Offices</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className="footer-social-icons">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-container"
        >
          <img src={instagram_icon} alt="Instagram" />
        </a>

        <a
          href="https://www.pinterest.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-container"
        >
          <img src={pinterest_icon} alt="Pinterest" />
        </a>

        <a
          href="https://wa.me/123456789"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-container"
        >
          <img src={whatsapp_icon} alt="WhatsApp" />
        </a>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>© {new Date().getFullYear()} Forever. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
