const FilePreview = ({ file, previewUrl }) => {
  if (file.type.startsWith("image/")) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={previewUrl}
          alt="File Preview"
          className="preview-image rounded-lg"
        />
      </div>
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
  } else if (file.name.endsWith(".pdg")) {
    return (
      <div className="text-sm text-gray-700">
        Preview for PDG files is not supported. You can download and view it
        locally.
      </div>
    );
  } else {
    return (
      <div className="text-sm text-gray-700">
        File preview not available for this format.
      </div>
    );
  }
};

export default FilePreview;
