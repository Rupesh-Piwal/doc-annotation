import React from 'react';
import FilePreview from './FilePreview';
import Loader from './Loader';
import { useFileUpload } from '../../hooks/useFileUpload';

const FileUpload = () => {
  const {
    selectedFile,
    filePreview,
    isLoading,
    isUploaded,
    handleFileChange,
    handleRemoveFile,
    handleUpload,
  } = useFileUpload();

  const handleExtract = () => {
    // Logic for extracting content can be added here
    console.log('Extracting content from file:', selectedFile);
  };

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dotted border-gray-400 p-4 rounded-lg w-[300px]">
      {!isUploaded && (
        <>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4"
            disabled={isLoading}
          />
          {selectedFile && (
            <div className="text-sm text-gray-700 mb-4">
              <div className="flex justify-between items-center">
                <span>Selected File: {selectedFile.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>
            </div>
          )}
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </>
      )}
      {isLoading && <Loader />}
      {isUploaded && (
        <>
          <FilePreview file={selectedFile} previewUrl={filePreview} />
          <button
            onClick={handleExtract}
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
          >
            Extract
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
