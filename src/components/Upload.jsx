import React from "react";

const Upload = () => {
  return (
    <div className="border-2 border-gray-400 w-[500px] h-[300px] rounded-lg border-dotted flex flex-col gap-6 justify-center items-center">
      <div className="text-center">
        <h1 className="text-gray-800 text-lg ">
          Choose a file or drag & drop it here
        </h1>
        <p className="text-gray-400">JPEG, PNG, PDG formats</p>
      </div>
      <div>
        <button className="px-4 py-1.5 rounded-md bg-blue-400 hover:bg-blue-500 text-white">
          Upload File
        </button>
      </div>
    </div>
  );
};

export default Upload;
