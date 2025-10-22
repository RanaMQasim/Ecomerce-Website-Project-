import React, { useEffect, useState } from "react";
import "./Offers.css";
import { getExclusiveOffers } from "../../services/api";
import exclusive_image from "../Assets/exclusive_image.png";

const Offers = () => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await getExclusiveOffers();
        console.log("getExclusiveOffers returned ->", res);
        const payload = res?.data ?? res ?? null;
        setOffer(payload && Object.keys(payload).length ? payload : null);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setOffer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="offers loading">
        <p>Loading exclusive offers...</p>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="offers no-offer">
        <p>No active offers at the moment. Please check back soon!</p>
      </div>
    );
  }

  return (
    <div className="offers">
      <div className="offers-left">
        <h1>{offer.title || "Exclusive"}</h1>
        <h1>{offer.subtitle || "Offers For You"}</h1>
        <p>{offer.description || "ONLY ON BEST SELLER PRODUCTS"}</p>
        <button
          onClick={() =>
            (window.location.href = offer.link || "/shop")
          }
        >
          {offer.buttonText || "Check Now"}
        </button>
      </div>

      <div className="offers-right">
        <img
          src={offer.image || exclusive_image}
          alt={offer.title || "Exclusive Offer"}
        />
      </div>
    </div>
  );
};

export default Offers;
