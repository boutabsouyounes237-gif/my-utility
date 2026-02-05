"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FileUploader, { UploadedFile } from "@/components/FileUploader";
import { processImageToPdf } from "@/lib/tools/image/image-to-pdf";
import { Loader2, CheckCircle2, RefreshCw, Download, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

export default function SingleToolPage() {
  const params = useParams();
  const router = useRouter();
  const group = params.group as string;
  const tool = params.tool as string;

  const [resultFiles, setResultFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStartProcessing = async (files: UploadedFile[]) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (tool === "image-to-pdf") {
        const result = await processImageToPdf(files, 10);
        setResultFiles([result]);
        confetti({ particleCount: 120, spread: 70 });
      }
    } catch (e: any) {
      setError(e.message || "Processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setResultFiles([]);
    setUploaderKey((p) => p + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* زر رجوع */}
      <button
        onClick={() => router.push(`/tools/${group}`)}
        className="group mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold uppercase tracking-wide text-slate-200 hover:bg-white/20 hover:text-white transition-all shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          {tool.replace(/-/g, " ")}
        </h1>
      </div>

      {error && <div className="mb-6 text-center font-bold text-red-500">{error}</div>}

      {resultFiles.length === 0 ? (
        <div className={isProcessing ? "opacity-40 pointer-events-none" : ""}>
          <FileUploader
            key={uploaderKey}
            allowedTypes={["image/*"]}
            onProcess={handleStartProcessing}
          />

          {isProcessing && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="font-bold text-blue-600 uppercase text-xs tracking-widest">
                Processing...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-10 rounded-[3rem] text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Ready</h2>

          <div className="grid gap-3 max-w-md mx-auto">
            {resultFiles.map((file, i) => (
              <a
                key={i}
                href={file.url}
                download={file.name}
                className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all"
              >
                <span className="truncate">{file.name}</span>
                <Download className="w-4 h-4" />
              </a>
            ))}

            <button
              onClick={resetAll}
              className="mt-6 flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-blue-600"
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
