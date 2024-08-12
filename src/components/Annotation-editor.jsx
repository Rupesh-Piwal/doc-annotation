import React from "react";

const AnnotationEditor = ({ annotation, onChange, onSubmit }) => (
  <div
    style={{
      background: "white",
      borderRadius: 3,
      position: "absolute",
      left: `${annotation.geometry.x}%`,
      top: `${annotation.geometry.y + annotation.geometry.height}%`,
    }}
    className="p-2 rounded-[10px] mt-[5px]"
  >
    <input
      onChange={(e) =>
        onChange({
          ...annotation,
          data: {
            ...annotation.data,
            key: e.target.value,
          },
        })
      }
      placeholder="Key"
      className="block mt-1 p-2 focus:outline-none"
    />
    <input
      onChange={(e) =>
        onChange({
          ...annotation,
          data: {
            ...annotation.data,
            value: e.target.value,
          },
        })
      }
      placeholder="Value"
      className="block mt-1 p-2 focus:outline-none"
    />
    <button
      onClick={onSubmit}
      className="text-[#fff] bg-[#4ca3dd] py-[2px] px-2 rounded-[5px] m-2"
    >
      Done
    </button>
  </div>
);

export default AnnotationEditor;
