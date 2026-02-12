"use client";

import React, { useRef, useState } from "react";
import type { UploadedFile } from "@/types/uploaded-file";

export interface FileUploaderProps {
  onUpload: (files: UploadedFile[]) => void;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, multiple = false }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList) => {
    const files: UploadedFile[] = Array.from(fileList).map((file) => ({
      data: file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    onUpload(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      }`}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <p className="text-gray-500 mb-2 text-center">
        Drag & drop your files here, or click to select
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <p className="text-gray-400 text-sm">
        {multiple ? "You can upload multiple files" : "Single file only"}
      </p>
    </div>
  );
};

export default FileUploader;
