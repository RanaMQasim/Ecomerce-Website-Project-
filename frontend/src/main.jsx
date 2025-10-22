import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import AuthProvider from "./store/AuthContext";
import ShopContextProvider from "./context/ShopContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ShopContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ShopContextProvider>
    </AuthProvider>
  </StrictMode>
);
