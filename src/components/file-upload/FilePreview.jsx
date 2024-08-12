import React, { useState, useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import Annotation from "react-image-annotation";
import { PDFDocument } from "pdf-lib";
import { saveFile } from "../../utils/fileUtils";
import PageSelector from "../PageSelector";
import AnnotationEditor from "../Annotation-editor";
import AnnotationRenderer from "../Annotation-render";
import Button from "../Button";
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@2.12.313/legacy/build/pdf.worker.min.js";

const FilePreview = ({ file, annotations, setAnnotations }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageImages, setPageImages] = useState([]);
  const [annotation, setAnnotation] = useState({});
  const [selectedPage, setSelectedPage] = useState(0);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        renderPagesAsImages(reader.result);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const renderPagesAsImages = async (arrayBuffer) => {
    const images = [];
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
      images.push(canvas.toDataURL());
    }
    setPageImages(images);
  };

  const handlePageSelection = (index) => {
    setSelectedPage(index);
  };

  const handleUndo = () => {
    if (undoStackRef.current.length > 0) {
      const lastAnnotations = undoStackRef.current.pop();
      redoStackRef.current.push([...annotations]);
      setAnnotations(lastAnnotations);
    }
  };

  const handleRedo = () => {
    if (redoStackRef.current.length > 0) {
      const nextAnnotations = redoStackRef.current.pop();
      undoStackRef.current.push([...annotations]);
      setAnnotations(nextAnnotations);
    }
  };

  const handleExtract = () => {
    const extractedData = annotations.map((annotation) => ({
      x: annotation.geometry.x,
      y: annotation.geometry.y,
      width: annotation.geometry.width,
      height: annotation.geometry.height,
      key: annotation.data.key,
      value: annotation.data.value,
    }));

    console.log("Extracted data:", JSON.stringify(extractedData, null, 2));
  };

  const handleDownload = async () => {
    // Fetch the original PDF file
    const response = await fetch(URL.createObjectURL(file));
    const pdfBytes = await response.arrayBuffer();

    // Load the PDF with pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Serialize the PDF to bytes
    const pdfData = await pdfDoc.save();

    // Save the PDF file
    saveFile(pdfData, "downloaded.pdf");
  };

  return (
    <div className="file-preview-container p-4">
      <PageSelector
        pageImages={pageImages}
        selectedPage={selectedPage}
        onPageSelection={handlePageSelection}
      />
      <div className="relative">
        {pageImages[selectedPage] && (
          <Annotation
            src={pageImages[selectedPage]}
            alt={`Page ${selectedPage + 1}`}
            annotations={annotations.filter(
              (annotation) => annotation.data.pageIndex === selectedPage
            )}
            type="RECTANGLE"
            value={annotation}
            onChange={setAnnotation}
            onSubmit={(newAnnotation) => {
              redoStackRef.current = [];
              const newAnnotationData = {
                ...newAnnotation,
                data: {
                  ...newAnnotation.data,
                  id: Math.random(),
                  pageIndex: selectedPage,
                },
              };
              setAnnotations((prev) => [...prev, newAnnotationData]);
              undoStackRef.current.push(annotations);
            }}
            renderSelector={AnnotationRenderer.renderSelector}
            renderHighlight={AnnotationRenderer.renderHighlight}
            renderContent={AnnotationRenderer.renderContent}
            renderEditor={(props) => (
              <AnnotationEditor {...props} onSubmit={props.onSubmit} />
            )}
          />
        )}
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={handleUndo} className="bg-[#E10000]">
          Undo
        </Button>
        <Button onClick={handleRedo} className="bg-[#0024E1]">
          Redo
        </Button>
        <Button onClick={handleExtract}>Extract</Button>
        <Button onClick={handleDownload} className="bg-[#4ca3dd]">
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
