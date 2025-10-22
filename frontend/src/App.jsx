import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import Footer from "./components/Footer/Footer";
import men_banner from "./components/Assets/banner_mens.png";
import women_banner from "./components/Assets/banner_women.png";
import kids_banner from "./components/Assets/banner_kids.png";
import { AuthProvider } from "./store/AuthContext";
import ShopContextProvider from "./context/ShopContext";

function App() {
  return (
    <AuthProvider>
      <ShopContextProvider>
        <div className="app-root">
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Shop />} />

              <Route
                path="/mens"
                element={<ShopCategory banner={men_banner} category="men" />}
              />

              <Route
                path="/womens"
                element={<ShopCategory banner={women_banner} category="women" />}
              />

              <Route
                path="/kids"
                element={<ShopCategory banner={kids_banner} category="kids" />}
              />

              <Route path="/product" element={<Product />} />
              <Route path="/product/:productId" element={<Product />} />

              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<LoginSignup />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </ShopContextProvider>
    </AuthProvider>
  );
}

export default App;