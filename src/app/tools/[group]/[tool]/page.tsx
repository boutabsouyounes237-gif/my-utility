// src/app/tools/[group]/[tool]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { IMAGE_TOOLS_PROCESSORS } from "@/lib/tools/registry";
import type { UploadedFile } from "@/types/uploaded-file";
import FileUploader from "@/components/FileUploader";

const ToolPage = () => {
  const params = useParams();
  const tool = params?.tool as string | undefined;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [resultFile, setResultFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  const toolProcessor =
    IMAGE_TOOLS_PROCESSORS[
      tool as keyof typeof IMAGE_TOOLS_PROCESSORS
    ];

  if (!toolProcessor) {
    return <div>Tool not found</div>;
  }

  const handleProcess = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);

    try {
      const result = await toolProcessor(uploadedFiles);

      const normalize = (file: any): UploadedFile => ({
  data: file.data ?? new File([], file.name ?? "output"),
  name: file.name ?? "output",
  size: file.size ?? 0,
  type: file.type ?? "application/octet-stream",
  url: file.url,
});

if (Array.isArray(result)) {
  setResultFile(result[0] ? normalize(result[0]) : null);
} else if (result) {
  setResultFile(normalize(result));
} else {
  setResultFile(null);
}

    } catch (err) {
      console.error(err);
      setResultFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{tool}</h1>

      <FileUploader
        multiple
        onUpload={(files) => setUploadedFiles(files)}
      />

      <button
        onClick={handleProcess}
        disabled={isProcessing || uploadedFiles.length === 0}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Process"}
      </button>

      {resultFile && (
        <div className="mt-4">
          <a
            href={resultFile.url}
            download={resultFile.name}
            className="text-blue-600 underline"
          >
            Download {resultFile.name}
          </a>
        </div>
      )}
    </div>
  );
};

export default ToolPage;
