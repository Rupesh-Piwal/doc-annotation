import React from "react";
import ReactImageAnnotate from "react-image-annotate";

const PDFAnnotator = ({ imageUrl }) => {
  return (
    <ReactImageAnnotate
      labelImages
      regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
      regionTagList={["tag1", "tag2", "tag3"]}
      images={[
        {
          src: imageUrl,
          name: "Annotated Image",
          regions: [],
        },
      ]}
    />
  );
};

export default PDFAnnotator;
