"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import { IMAGE_TOOLS_PROCESSORS } from "@/lib/tools/registry";
import type { UploadedFile } from "@/types/uploaded-file";
// @ts-ignore
import confetti from "canvas-confetti";
import {
  Download,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Image as ImageIcon,
  ArrowLeft
} from "lucide-react";

export default function SingleToolPage() {
  const { tool } = useParams<{ tool: string }>();
  const router = useRouter();

  const [resultFiles, setResultFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const handleStartProcessing = async (files: UploadedFile[]) => {
    if (!files.length) return;

    const processor =
      IMAGE_TOOLS_PROCESSORS[tool as keyof typeof IMAGE_TOOLS_PROCESSORS];
    if (!processor) return;

    setIsProcessing(true);

    try {
      const result = await processor(files);

      const normalized: UploadedFile[] = Array.isArray(result)
        ? result.map((f: any) => ({
            data: f.data || null,
            name: f.name || "unknown",
            size: f.size || 0,
            type: f.type || "",
            url: f.url || "",
          }))
        : [
            {
              data: (result as any).data || null,
              name: (result as any).name || "unknown",
              size: (result as any).size || 0,
              type: (result as any).type || "",
              url: (result as any).url || "",
            },
          ];

      setResultFiles(normalized);
      confetti({ particleCount: 120, spread: 60 });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setResultFiles([]);
    setUploaderKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* زر رجوع احترافي */}
      <button
        onClick={() => router.back()}
        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Tools
      </button>

      {/* عنوان */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight capitalize">
          {String(tool).replace(/-/g, " ")}
        </h1>
        <p className="text-gray-500 mt-3 text-sm">
          Fast, secure and browser-based processing.
        </p>
      </div>

      {resultFiles.length === 0 ? (
        <div className="relative">

          {/* Glass Blue Upload Zone */}
          <div className="
            rounded-3xl 
            border border-blue-200 
            bg-linear-to-br from-blue-50/60 to-blue-100/40
            backdrop-blur-xl
            shadow-xl
            p-12
            text-center
            transition-all
            hover:shadow-2xl
            hover:scale-[1.01]
          ">

            <div className="mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/10 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">
              Drag & Drop your files
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              or click below to browse from your device
            </p>

            <FileUploader
              key={uploaderKey}
              multiple
              onUpload={handleStartProcessing}
            />

          </div>

          {/* Loader */}
          {isProcessing && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-xs uppercase tracking-widest font-bold text-blue-600 animate-pulse">
                Processing...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-in fade-in duration-500">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">
            Files Ready
          </h2>

          <div className="grid gap-4 max-w-lg mx-auto">
            {resultFiles.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                download={file.name}
                className="flex items-center justify-between bg-blue-600 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all group"
              >
                <span className="truncate text-sm">
                  {file.name}
                </span>
                <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            ))}

            <button
              onClick={resetAll}
              className="mt-8 flex items-center justify-center gap-2 text-gray-500 font-semibold hover:text-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start New Conversion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
