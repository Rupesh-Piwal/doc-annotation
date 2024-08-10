import React, { useCallback, useState, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";

// Custom useResizeObserver hook
const useResizeObserver = (ref, callback) => {
  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver((entries) => {
        entries.forEach(callback);
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref, callback]);
};

// Point to the worker path
pdfjs.GlobalWorkerOptions.workerSrc =
  "/node_modules/pdfjs-dist/build/pdf.worker.min.js";

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

  return (
    <div className="file-preview-container">
      <div ref={setContainerRef} className="file-preview">
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
      </div>
    </div>
  );
};

export default FilePreview;
