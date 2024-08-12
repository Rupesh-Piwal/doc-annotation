import React, { useState, useEffect, useRef } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import Annotation from "react-image-annotation";
import ReactImageAnnotate from "react-image-annotate";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@2.12.313/legacy/build/pdf.worker.min.js";

const FilePreview = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageImages, setPageImages] = useState([]);
  const [annotations, setAnnotations] = useState([]);
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
        {annotation.data && annotation.data.text}
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
                text: e.target.value,
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
                text: e.target.value,
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

    setAnnotation({});
    const newAnnotationData = {
      geometry,
      data: {
        ...data,
        id: Math.random(),
        pageIndex: selectedPage,
      },
    };

    setAnnotations([...annotations, newAnnotationData]);

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

  return (
    <div className="file-preview-container p-4 rounded-lg mt-[300px] mb-4 border-2 border-dotted border-gray-400">
      <div className="file-preview">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages && pageImages.length > 0 && (
            <div>
              <div className="flex gap-4 justify-center items-center my-4">
                <button
                  className={style.button}
                  onClick={handleUndo}
                  type="button"
                >
                  Undo
                </button>
                <button
                  className={style.button}
                  onClick={handleRedo}
                  type="button"
                >
                  Redo
                </button>
              </div>
              <Annotation
                src={pageImages[selectedPage]}
                alt={`Page ${selectedPage + 1}`}
                annotations={annotations.filter(
                  (anno) => anno.data.pageIndex === selectedPage
                )}
                value={annotation}
                type={annotation.type}
                className="h-[500px] w-auto cursor-crosshair"
                onChange={onChange}
                onSubmit={onSubmit}
                allowTouch
                renderOverlay={() => null}
                renderSelector={renderSelector}
                renderHighlight={renderHighlight}
                renderContent={renderContent}
                renderEditor={renderEditor}
              />
              <div className="mt-[4%] flex flex-wrap gap-4 items-center justify-center mb-4">
                {pageImages?.map((src, index) => (
                  <div key={index} className="h-[70px]">
                    <img
                      src={src}
                      onClick={() => handlePageSelection(index)}
                      alt={`Page ${index + 1}`}
                      className="w-[100px] h-full cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Document>
      </div>
    </div>
  );
};

export default FilePreview;
