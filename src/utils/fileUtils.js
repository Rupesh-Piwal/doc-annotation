import { saveAs } from "file-saver";

export const saveFile = (data, fileName) => {
  const blob = new Blob([data], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
