"use client";

import React from "react";
import type { UploadedFile } from "@/types/uploaded-file";

export interface FileUploaderProps {
  onUpload: (files: UploadedFile[]) => void;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  multiple = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files: UploadedFile[] = Array.from(e.target.files).map((file) => ({
      data: file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    onUpload(files);
  };

  return (
    <input
      type="file"
      multiple={multiple}
      onChange={handleChange}
      className="block w-full"
    />
  );
};

export default FileUploader;
