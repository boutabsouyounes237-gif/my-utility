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
  ArrowLeft,
  UploadCloud
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
    <div className="relative max-w-5xl mx-auto px-6 py-14">

      {/* زر رجوع احترافي */}
      <button
        onClick={() => router.back()}
        className="mb-12 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* العنوان */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight capitalize">
          {String(tool).replace(/-/g, " ")}
        </h1>
        <p className="text-slate-500 mt-3 text-sm">
          Secure • Private • Browser-Based Processing
        </p>
      </div>

      {resultFiles.length === 0 ? (
        <>
          {/* 🔵 Upload Zone - كيان واحد فقط */}
          <div
            className={`
              relative
              rounded-[2.5rem]
              p-16
              text-center
              transition-all
              duration-300
              bg-linear-to-br from-blue-50/70 via-blue-100/40 to-white
              backdrop-blur-2xl
              border border-blue-200/60
              shadow-[0_20px_60px_-15px_rgba(37,99,235,0.35)]
              hover:shadow-[0_30px_80px_-15px_rgba(37,99,235,0.45)]
              hover:scale-[1.015]
            `}
          >
            {/* glow subtle */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-blue-500/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6">

              <UploadCloud className="w-14 h-14 text-blue-600" />

              <h2 className="text-2xl font-bold tracking-tight">
                Drop files here
              </h2>

              <p className="text-slate-500 text-sm max-w-md">
                Drag & drop your files or click below to upload.
                All processing happens locally in your browser.
              </p>

              <div className="mt-4">
                <FileUploader
                  key={uploaderKey}
                  multiple
                  onUpload={handleStartProcessing}
                />
              </div>

            </div>
          </div>

          {/* Loader */}
          {isProcessing && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <span className="text-xs font-bold tracking-widest uppercase text-blue-600 animate-pulse">
                Processing...
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-14 text-center animate-in fade-in duration-500">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-8" />

          <h2 className="text-2xl font-black mb-10 tracking-tight">
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
              className="mt-10 flex items-center justify-center gap-2 text-slate-500 font-semibold hover:text-blue-600 transition-colors"
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
