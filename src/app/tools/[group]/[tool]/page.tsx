// src/app/tools/[group]/[tool]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IMAGE_TOOLS_PROCESSORS } from "@/lib/tools/registry";
import type { UploadedFile } from "@/types/uploaded-file";
import FileUploader from "@/components/FileUploader";

const ToolPage: React.FC = () => {
  const router = useRouter();
  const { group, tool } = useParams<{ group: string; tool: string }>();

  // حالات الملفات
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [resultFile, setResultFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // اختيار الـ processor المناسب
  const toolProcessor = IMAGE_TOOLS_PROCESSORS[tool as keyof typeof IMAGE_TOOLS_PROCESSORS];

  if (!toolProcessor) {
    return <div className="p-4 text-red-600 font-bold">Tool not found</div>;
  }

  const handleProcess = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    try {
      const result = await toolProcessor(uploadedFiles);
      if (Array.isArray(result)) {
        setResultFile(result[0] as UploadedFile);
      } else {
        setResultFile(result as UploadedFile);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* زر الرجوع للخلف */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold mb-6 capitalize">{tool}</h1>

      {/* منطقة Drag & Drop */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
        <p className="mb-2 text-gray-600">Drag & Drop your files here</p>
        <p className="mb-4 text-gray-400 text-sm">or click below to select files</p>

        <FileUploader
          multiple
          onUpload={(files: UploadedFile[]) => setUploadedFiles(files)}
        />
      </div>

      {/* عرض الملفات المرفوعة */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Uploaded Files:</h2>
          <ul className="list-disc list-inside">
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* زر المعالجة */}
      <button
        onClick={handleProcess}
        disabled={isProcessing || uploadedFiles.length === 0}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isProcessing ? "Processing..." : "Process"}
      </button>

      {/* عرض النتيجة */}
      {resultFile && (
        <div className="mt-6">
          <p className="font-semibold mb-2">Result:</p>
          <a
            href={resultFile.url}
            target="_blank"
            rel="noopener noreferrer"
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
