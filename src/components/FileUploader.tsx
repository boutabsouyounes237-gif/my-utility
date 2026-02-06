"use client";

import React, { useRef } from "react";
import { UploadCloud } from "lucide-react";
import type { UploadedFile } from "@/types/uploaded-file";

type FileUploaderProps = {
  allowedTypes: string[];
  onProcess: (files: UploadedFile[]) => void | Promise<void>;
};

export default function FileUploader({ allowedTypes, onProcess }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const parsed: UploadedFile[] = Array.from(files).map((file) => ({
      data: file,
      file,
      name: file.name,
      size: file.size,
      type: file.type || "image/jpeg", // fallback type
    }));

    onProcess(parsed);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-slate-300 rounded-[3rem] p-14 text-center cursor-pointer hover:border-blue-500 transition"
    >
      <UploadCloud className="w-14 h-14 mx-auto text-blue-500 mb-6" />
      <p className="font-black text-xl mb-2">Click to upload files</p>
      <p className="text-sm text-slate-500">Allowed: {allowedTypes.join(", ")}</p>

      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={allowedTypes.join(",")}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
