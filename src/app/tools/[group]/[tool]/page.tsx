"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import { IMAGE_TOOLS_PROCESSORS } from "@/lib/tools/registry";
import type { UploadedFile } from "@/types/uploaded-file";
// @ts-ignore
import confetti from "canvas-confetti";
import { Download, CheckCircle2, RefreshCw, Loader2, Image as ImageIcon } from "lucide-react";

export default function SingleToolPage() {
  const { tool } = useParams<{ tool: string }>();
  const [resultFiles, setResultFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const handleStartProcessing = async (files: UploadedFile[]) => {
    if (!files.length) return;
    const processor = IMAGE_TOOLS_PROCESSORS[tool as keyof typeof IMAGE_TOOLS_PROCESSORS];
    if (!processor) return;

    setIsProcessing(true);

    try {
      const result = await processor(files);

      // Normalize result to UploadedFile[]
      const normalizedResult: UploadedFile[] = Array.isArray(result)
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

      setResultFiles(normalizedResult);
      confetti({ particleCount: 150, spread: 70 });
    } catch (error) {
      console.error("Processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setResultFiles([]);
    setUploaderKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          {String(tool).replace(/-/g, " ")}
        </h1>
      </div>

      {resultFiles.length === 0 ? (
        <div className={isProcessing ? "opacity-40 pointer-events-none" : ""}>
          {/* Drag & Drop zone */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 mb-6 text-center transition-all hover:border-blue-500 hover:bg-blue-50">
            <p className="text-gray-600 mb-2 text-lg">Drag & Drop your files here</p>
            <p className="text-gray-400 text-sm mb-4">or click below to select files</p>
            <FileUploader key={uploaderKey} multiple onUpload={handleStartProcessing} />
          </div>

          {isProcessing && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="font-bold text-blue-600 animate-pulse uppercase text-xs tracking-widest">
                Processing...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-10 rounded-[3rem] text-center animate-in zoom-in duration-500">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">
            Files Processed Successfully!
          </h2>

          <div className="grid gap-3 max-w-md mx-auto">
            {resultFiles.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                download={file.name}
                className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm truncate max-w-45">{file.name}</span>
                </div>
                <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            ))}

            <button
              onClick={resetAll}
              className="mt-6 flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Start New Conversion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
