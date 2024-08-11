const Skeleton = ({
  width = "100%",
  height = "100%",
  borderRadius = "4px",
}) => {
  return (
    <div
      className="bg-gray-200 animate-pulse"
      style={{ width, height, borderRadius }}
    ></div>
  );
};
