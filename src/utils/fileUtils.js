// src/utils/fileUtils.js
import { saveAs } from 'file-saver';

// Function to save a file
export const saveFile = (data, fileName) => {
  const blob = new Blob([data], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};
