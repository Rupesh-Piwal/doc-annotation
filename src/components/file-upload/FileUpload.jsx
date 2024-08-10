import React, { useState, useRef } from "react";
import Loader from "./Loader";
import { useFileUpload } from "../../hooks/useFileUpload";
import FilePreview from "./FilePreview.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  const [pdfUrl, setPdfUrl] = useState(null);
  const contentRef = useRef();

  const handleExtract = () => {
    // Logic for extracting content can be added here
    console.log("Extracting content from file:", selectedFile);
  };

  const handleGeneratePdf = async () => {
    const doc = new jsPDF();

    // Capture HTML content as canvas
    const canvas = await html2canvas(contentRef.current);
    const imgData = canvas.toDataURL("image/png");

    // Add image to PDF
    doc.addImage(imgData, "PNG", 0, 0);

    // Save the PDF as a Blob
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center border-2 border-dotted border-gray-400 p-4 rounded-lg w-[600px] h-[95%]">
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
          <div
            ref={contentRef}
            style={{ padding: "20px", border: "1px solid #ddd" }}
          >
            <FilePreview file={selectedFile} previewUrl={filePreview} />
          </div>
          <button
            onClick={handleGeneratePdf}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mb-4"
          >
            Generate PDF
          </button>
          {pdfUrl && (
            <div>
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                width="100%"
                height="600px"
                style={{ border: "none" }}
              />
            </div>
          )}
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
