import React from "react";

const FilePreview = ({ file, previewUrl }) => {
  if (!file || !previewUrl) return null;

  if (file.type.startsWith("image/")) {
    return (
      <img
        src={previewUrl}
        alt="File Preview"
        className="max-w-full h-auto rounded-lg"
      />
    );
  } else if (file.type === "application/pdf") {
    return (
      <embed
        src={previewUrl}
        type="application/pdf"
        width="100%"
        height="400px"
        className="rounded-lg"
      />
    );
  } else {
    return (
      <div className="text-sm text-gray-700">File preview not available</div>
    );
  }
};

export default FilePreview;
