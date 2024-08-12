import React from "react";

const PageSelector = ({ pageImages, selectedPage, onPageSelection }) => (
  <div className="flex justify-center mb-4">
    {pageImages.map((_, index) => (
      <button
        key={index}
        onClick={() => onPageSelection(index)}
        className={`${
          selectedPage === index ? "bg-blue-500" : "bg-gray-300"
        } text-white font-bold py-2 px-4 rounded mx-1`}
      >
        Page {index + 1}
      </button>
    ))}
  </div>
);

export default PageSelector;
