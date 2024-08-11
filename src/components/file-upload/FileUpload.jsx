import React from "react";
import Loader from "./Loader";
import { useFileUpload } from "../../hooks/useFileUpload";
import FilePreview from "./FilePreview";

const FileUpload = () => {
  const {
    selectedFile,
    filePreview,
    isLoading,
    isUploaded,
    handleFileChange,
    handleRemoveFile,
    handleUpload,
  } = useFileUpload();

  const handleExtract = () => {
    // Logic for extracting content can be added here
    console.log("Extracting content from file:", selectedFile);
  };

  return (
    <div
      className={`flex flex-col gap-4 items-center justify-center p-4 rounded-lg w-[600px] h-[90%] ${
        isUploaded ? "border-0" : "border-2 border-dotted border-gray-400"
      }`}
    >
      {!isUploaded && (
        <>
          <input
            type="file"
            name="file"
            accept=".png, .jpeg, .jpg, .pdf, .pdg"
            onChange={handleFileChange}
            className="mb-4 cursor-pointer"
            disabled={isLoading}
          />
          {selectedFile && (
            <div className="text-sm text-gray-700 mb-4">
              <div className="flex justify-between items-center">
                <span className="border p-2 rounded font-semibold">
                  Selected File:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedFile.name}
                  </span>
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="ml-2 text-white bg-red-400 font-bold hover:bg-red-500 border py-1.5 px-2 rounded"
                >
                  X
                </button>
              </div>
            </div>
          )}
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </>
      )}
      {isLoading && <Loader />}
      {isUploaded && (
        <>
          <FilePreview file={selectedFile} previewUrl={filePreview} />
          <button
            onClick={handleExtract}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            Extract
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
