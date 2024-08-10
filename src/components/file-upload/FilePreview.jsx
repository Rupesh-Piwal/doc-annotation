import React from "react";

const FilePreview = ({ file, previewUrl }) => {
  if (!file || !previewUrl) return null;

  return (
    <div>
      {file.type.startsWith("image/") ? (
        <img
          src={previewUrl}
          alt="File Preview"
          className="max-w-full h-auto rounded-lg"
          style={{ maxHeight: "400px", objectFit: "contain" }}
        />
      ) : file.type === "application/pdf" ? (
        <embed
          src={previewUrl}
          type="application/pdf"
          width="100%"
          height="400px"
          className="rounded-lg"
        />
      ) : (
        <div className="text-sm text-gray-700">File preview not available</div>
      )}
    </div>
  );
};

export default FilePreview;
