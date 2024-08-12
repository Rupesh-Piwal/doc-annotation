import React from "react";

const Button = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-[#fff] bg-[#4ca3dd] py-[2px] px-2 rounded-[5px] ${className}`}
  >
    {children}
  </button>
);

export default Button;
