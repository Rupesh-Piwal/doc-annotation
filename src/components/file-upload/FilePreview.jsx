import React, { useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";

const FilePreview = ({ file, previewUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (file && file.type === "application/pdf" && previewUrl) {
      const renderPdf = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!canvas || !ctx) return;

        const response = await fetch(previewUrl);
        const arrayBuffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // Assuming a single page PDF
        const [page] = pdfDoc.getPages();
        const { width, height } = page.getSize();

        canvas.width = width;
        canvas.height = height;

        const pdfPage = await page.render();
        ctx.drawImage(pdfPage, 0, 0, width, height);
      };

      renderPdf();
    }
  }, [file, previewUrl]);

  return (
    <div>
      {file && file.type === "application/pdf" ? (
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
      ) : file.type.startsWith("image/") ? (
        <img
          src={previewUrl}
          alt="File Preview"
          className="max-w-full h-auto rounded-lg"
          style={{ maxHeight: "400px", objectFit: "contain" }}
        />
      ) : (
        <div className="text-sm text-gray-700">File preview not available</div>
      )}
    </div>
  );
};

export default FilePreview;
