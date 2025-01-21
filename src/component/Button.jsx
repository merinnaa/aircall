import React from "react";
import PropTypes from "prop-types";

const Button = ({ label, onClick, style }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 15px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        backgroundColor: "#f0f0f0",
        cursor: "pointer",
        ...style, // Allow custom styles to override defaults
      }}
    >
      {label}
    </button>
  );
};

export default Button;