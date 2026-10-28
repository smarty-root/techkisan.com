import React from "react";
import "../styles/Loader.css";

const Loader = ({ text = "Loading..." }) => (
  <div className="loader-overlay">
    <div className="loader-modal">
      <div className="loader-spinner"></div>
      <div className="loader-brand">TechKisan</div>
      <div className="loader-message">{text}</div>
    </div>
  </div>
);

export default Loader; 