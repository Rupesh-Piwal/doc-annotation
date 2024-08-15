import { useState } from "react";

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
    setIsUploaded(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setIsUploaded(false);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        setIsUploaded(true);
      }, 1000);
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
