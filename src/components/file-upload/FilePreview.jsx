import useResizeObserver from "@react-hook/resize-observer";
import React, { useCallback, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";

// Use the external CDN URL for the PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const FilePreview = ({ file, previewUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);

  const onResize = useCallback((entry) => {
    setContainerWidth(entry.contentRect.width);
  }, []);

  useResizeObserver(containerRef, onResize);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  // Determine if the file is a PDF or an image
  const isPDF = file?.type === 'application/pdf' || previewUrl?.endsWith('.pdf');
  const isImage = file?.type.startsWith('image/') || previewUrl?.match(/\.(jpg|jpeg|png)$/i);

  return (
    <div className="file-preview-container">
      <div ref={setContainerRef} className="file-preview">
        {isPDF ? (
          <Document
            file={file || previewUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={containerWidth ? Math.min(containerWidth, 800) : 800}
              />
            ))}
          </Document>
        ) : isImage ? (
          <img
            src={file ? URL.createObjectURL(file) : previewUrl}
            alt="Preview"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        ) : (
          <p>Unsupported file type</p>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
