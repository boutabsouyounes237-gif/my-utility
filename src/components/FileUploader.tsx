"use client";

import React, { useRef, useState } from "react";
import type { UploadedFile } from "@/types/uploaded-file";

export interface FileUploaderProps {
  onUpload: (files: UploadedFile[]) => void;
  multiple?: boolean;
  children: React.ReactNode;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  multiple = false,
  children,
}) => {
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
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`cursor-pointer transition-all ${
          isDragging ? "scale-[1.02]" : ""
        }`}
      >
        {children}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        hidden
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </>
  );
};

export default FileUploader;
