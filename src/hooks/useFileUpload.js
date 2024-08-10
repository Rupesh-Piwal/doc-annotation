import { useState } from "react";

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Generate a preview URL for the selected file
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
    setIsUploaded(false); // Reset upload state if new file is selected
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setIsUploaded(false);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsLoading(true);

      // Simulate a file upload process with a timeout
      setTimeout(() => {
        setIsLoading(false);
        setIsUploaded(true);
      }, 2000); // Simulate a 2-second upload
    } else {
      console.log("No file selected");
    }
  };

  return {
    selectedFile,
    filePreview,
    isLoading,
    isUploaded,
    handleFileChange,
    handleRemoveFile,
    handleUpload,
  };
};
