import React, { useCallback, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@2.12.313/legacy/build/pdf.worker.min.js";

const FilePreview = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState(800);

  const onResize = useCallback((entries) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <div className="file-preview-container p-4 rounded-lg mt-[300px] mb-4 border-2 border-dotted border-gray-400">
      <div ref={setContainerRef} className="file-preview">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages &&
            Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                height={
                  document.getElementsByClassName("PdfDiv")[0]?.clientHeight *
                    0.8 ?? 150
                }
                // width={Math.min(containerWidth, 500)}
              />
            ))}
        </Document>
      </div>
    </div>
  );
};

export default FilePreview;
