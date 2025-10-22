import React, { useState } from "react";
import "./NewsLetter.css";
import { subscribeNewsletter } from "../../services/api";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setMessage("");

    try {
      await subscribeNewsletter(email);
      setStatus("success");
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      console.error("Subscription failed", err);
      setStatus("error");
      setMessage("Subscription failed. Please try again later.");
    }
  };

  return (
    <div className="newsletter">
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>

      <div className="newsletter-form">
        <input
          type="email"
          placeholder="Your Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
        />
        <button
          onClick={handleSubscribe}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      {message && (
        <div
          className={`newsletter-message ${
            status === "success" ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};
export default NewsLetter;