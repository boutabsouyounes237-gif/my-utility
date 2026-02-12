"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IMAGE_TOOLS_PROCESSORS } from "@/lib/tools/registry";
import type { UploadedFile } from "@/types/uploaded-file";
import FileUploader from "@/components/FileUploader";

interface FileProgress extends UploadedFile {
  progress: number; // نسبة التقدم من 0 إلى 100
}

const ToolPage: React.FC = () => {
  const router = useRouter();
  const { tool } = useParams<{ tool: string }>();

  const [uploadedFiles, setUploadedFiles] = useState<FileProgress[]>([]);
  const [resultFiles, setResultFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toolProcessor = IMAGE_TOOLS_PROCESSORS[tool as keyof typeof IMAGE_TOOLS_PROCESSORS];
  if (!toolProcessor)
    return <div className="p-4 text-red-600 font-bold">Tool not found</div>;

  const handleProcess = async () => {
    if (!uploadedFiles.length) return;

    setIsProcessing(true);
    setResultFiles([]);

    try {
      const results: UploadedFile[] = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];

        // تحديث progress إلى 0 قبل المعالجة
        const tempFiles = [...uploadedFiles];
        tempFiles[i] = { ...file, progress: 0 };
        setUploadedFiles(tempFiles);

        // استدعاء الـ processor
        const result = await toolProcessor([file]);

        // التأكد من تحويل النتيجة إلى UploadedFile صالح
        const processedFile: UploadedFile =
          Array.isArray(result) && result.length
            ? {
                data: (result[0] as any).data || null,
                name: (result[0] as any).name || "unknown",
                size: (result[0] as any).size || 0,
                type: (result[0] as any).type || "",
                url: (result[0] as any).url || "",
              }
            : {
                data: (result as any).data || null,
                name: (result as any).name || "unknown",
                size: (result as any).size || 0,
                type: (result as any).type || "",
                url: (result as any).url || "",
              };

        results.push(processedFile);

        // بعد المعالجة، progress 100%
        tempFiles[i] = { ...file, progress: 100 };
        setUploadedFiles([...tempFiles]);
      }

      setResultFiles(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = (files: UploadedFile[]) => {
    const filesWithProgress: FileProgress[] = files.map((file) => ({
      ...file,
      progress: 0,
    }));
    setUploadedFiles(filesWithProgress);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* زر الرجوع */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
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

      {/* Drag & Drop zone */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 mb-6 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
        <p className="text-gray-600 mb-2 text-lg">Drag & Drop your files here</p>
        <p className="text-gray-400 text-sm mb-4">or click below to select files</p>

        <FileUploader multiple onUpload={handleUpload} />
      </div>

      {/* الملفات المرفوعة مع progress bar */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {uploadedFiles.map((file, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <p className="font-semibold mb-2 truncate">{file.name}</p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              {isProcessing && <p className="text-sm text-gray-500 mt-1">{file.progress}%</p>}
            </div>
          ))}
        </div>
      )}

      {/* زر المعالجة */}
      <button
        onClick={handleProcess}
        disabled={isProcessing || uploadedFiles.length === 0}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50 transition-colors mb-6"
      >
        {isProcessing ? "Processing..." : "Process"}
      </button>

      {/* عرض النتائج */}
      {resultFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resultFiles.map((file, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:shadow-md transition-shadow"
            >
              <p className="font-semibold mb-2 truncate">{file.name}</p>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolPage;
