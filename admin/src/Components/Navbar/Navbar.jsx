import React from "react";
import "./Navbar.css";
import adminLogo from "../../assets/admin-logo.png";
import notificationIcon from "../../assets/notification-icon.jpg";

const Navbar = () => {
  const notifCount = 3; 

  return (
    <div className="navbar">
      <div className="nav-left">
        <img src={adminLogo} alt="Admin Logo" className="nav-logo" />
        <span className="nav-brand">FOREVER ADMIN PANEL</span>
      </div>
      <div className="nav-center">
        <input
          type="text"
          placeholder="Search..."
          className="nav-search"
        />
      </div>
      <div className="nav-right">
        <div className={`notif-wrap ${notifCount > 0 ? "has-notif" : ""}`}>
          <img
            src={notificationIcon}
            alt="Notification"
            className="nav-notification"
          />
          {notifCount > 0 && (
            <span className="notif-badge">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
