import React from 'react';

const Box = ({ children, geometry, style }) => (
  <div
    style={{
      ...style,
      position: "absolute",
      left: `${geometry.x}%`,
      top: `${geometry.y}%`,
      height: `${geometry.height}%`,
      width: `${geometry.width}%`,
    }}
  >
    {children}
  </div>
);

const AnnotationRenderer = {
  renderSelector: ({ annotation }) => {
    const { geometry } = annotation;
    if (!geometry) return null;

    return (
      <Box
        geometry={geometry}
        style={{ border: `solid 2px #E10000` }}
      />
    );
  },

  renderHighlight: ({ annotation }) => {
    const { geometry } = annotation;
    const idIntegerPart = Math.floor(geometry?.height);
    if (!geometry) return null;

    return (
      <Box
        key={annotation.data.id}
        geometry={geometry}
        style={{ border: `solid 3px ${idIntegerPart % 2 !== 0 ? "#E10000" : "#0024E1"}` }}
      />
    );
  },

  renderContent: ({ annotation }) => {
    const { geometry } = annotation;
    const idIntegerPart = Math.floor(geometry?.height);
    return (
      <div
        key={annotation.data.id}
        style={{
          background: `${idIntegerPart % 2 !== 0 ? "#C60606" : "#0653C6"}`,
          color: "white",
          paddingRight: 10,
          paddingLeft: 10,
          fontWeight: "bolder",
          fontSize: 15,
          position: "absolute",
          left: `${geometry.x}%`,
          top: `${geometry.y - 9}%`,
        }}
      >
        {annotation.data && `${annotation.data.key}: ${annotation.data.value}`}
      </div>
    );
  },
};

export default AnnotationRenderer;
