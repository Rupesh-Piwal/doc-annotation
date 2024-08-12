import React, { useState, useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import Annotation from "react-image-annotation";
import { PDFDocument } from "pdf-lib";
import { saveFile } from "../../utils/fileUtils";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@2.12.313/legacy/build/pdf.worker.min.js";

const FilePreview = ({ file, annotations, setAnnotations }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageImages, setPageImages] = useState([]);
  const [annotation, setAnnotation] = useState({});
  const [selectedPage, setSelectedPage] = useState(0);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  useEffect(() => {
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

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        renderPagesAsImages(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const style = {
    button: "text-[#fff] bg-[#4ca3dd] py-[2px] px-2 rounded-[5px]",
  };

  const Box = ({ children, geometry, style }) => (
    <div
      style={{
        ...style,
        position: "absolute",
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        height: `${geometry.height}%`,
        width: `${geometry.width}%`,
      }}
    >
      {children}
    </div>
  );

  function renderSelector({ annotation }) {
    const { geometry } = annotation;
    if (!geometry) return null;

    return (
      <Box
        geometry={geometry}
        style={{
          border: `solid 2px #E10000`,
        }}
      />
    );
  }

  function renderHighlight({ annotation }) {
    const { geometry } = annotation;
    const idIntegerPart = Math.floor(geometry?.height);

    if (!geometry) return null;

    return (
      <Box
        key={annotation.data.id}
        geometry={geometry}
        style={{
          border: `solid 3px ${
            idIntegerPart % 2 !== 0 ? "#E10000" : "#0024E1"
          }`,
        }}
      />
    );
  }

  function renderContent({ annotation }) {
    const { geometry } = annotation;
    const idIntegerPart = Math.floor(geometry?.height);
    return (
      <div
        key={annotation.data.id}
        style={{
          background: `${idIntegerPart % 2 !== 0 ? "#C60606" : "#0653C6"}`,
          color: "white",
          paddingRight: 10,
          paddingLeft: 10,
          fontWeight: "bolder",
          fontSize: 15,
          position: "absolute",
          left: `${geometry.x}%`,
          top: `${geometry.y - 9}%`,
        }}
      >
        {annotation.data && `${annotation.data.key}: ${annotation.data.value}`}
      </div>
    );
  }

  function renderEditor(props) {
    const { geometry } = props.annotation;
    if (!geometry) return null;

    return (
      <div
        style={{
          background: "white",
          borderRadius: 3,
          position: "absolute",
          left: `${geometry.x}%`,
          top: `${geometry.y + geometry.height}%`,
        }}
        className="p-2 rounded-[10px] mt-[5px]"
      >
        <input
          onChange={(e) =>
            props.onChange({
              ...props.annotation,
              data: {
                ...props.annotation.data,
                key: e.target.value,
              },
            })
          }
          placeholder="Key"
          className="block mt-1 p-2 focus:outline-none"
        />
        <input
          onChange={(e) =>
            props.onChange({
              ...props.annotation,
              data: {
                ...props.annotation.data,
                value: e.target.value,
              },
            })
          }
          placeholder="Value"
          className="block mt-1 p-2 focus:outline-none"
        />

        <button onClick={props.onSubmit} className={`${style.button} m-2`}>
          Done
        </button>
      </div>
    );
  }

  const onChange = (newAnnotation) => {
    setAnnotation(newAnnotation);
  };

  const onSubmit = (newAnnotation) => {
    const { geometry, data } = newAnnotation;

    redoStackRef.current = [];

    const newAnnotationData = {
      geometry,
      data: {
        ...data,
        id: Math.random(),
        pageIndex: selectedPage,
      },
    };

    setAnnotations((prevAnnotations) => [
      ...prevAnnotations,
      newAnnotationData,
    ]);
    undoStackRef.current.push(annotations);
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

  const saveFile = (data, fileName) => {
    const blob = new Blob([data], { type: "application/pdf" });
    saveAs(blob, fileName);
  };

  return (
    <div className="file-preview-container p-4">
      <div className="flex justify-center mb-4">
        {pageImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageSelection(index)}
            className={`${
              selectedPage === index ? "bg-blue-500" : "bg-gray-300"
            } text-white font-bold py-2 px-4 rounded mx-1`}
          >
            Page {index + 1}
          </button>
        ))}
      </div>
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
            onChange={onChange}
            onSubmit={onSubmit}
            renderSelector={renderSelector}
            renderHighlight={renderHighlight}
            renderContent={renderContent}
            renderEditor={renderEditor}
          />
        )}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleUndo}
          className={`${style.button} bg-[#E10000] m-2`}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className={`${style.button} bg-[#0024E1] m-2`}
        >
          Redo
        </button>
        <button onClick={handleExtract} className={`${style.button} m-2`}>
          Extract
        </button>
        <button
          onClick={handleDownload}
          className={`${style.button} bg-[#4ca3dd] m-2`}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default FilePreview;
