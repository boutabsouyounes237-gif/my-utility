"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // أضفنا useRouter للرجوع
import FileUploader from "@/components/FileUploader";
import { IMAGE_TOOLS_PROCESSORS } from "@/lib/tools/registry";
import type { UploadedFile } from "@/types/uploaded-file";
// @ts-ignore
import confetti from "canvas-confetti";
import { Download, CheckCircle2, RefreshCw, Loader2, Image as ImageIcon, ChevronLeft } from "lucide-react";

export default function SingleToolPage() {
  const { tool, group } = useParams<{ tool: string; group: string }>();
  const router = useRouter();
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
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
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
    <div className="max-w-4xl mx-auto px-6 py-12 relative animate-in fade-in duration-700">
      
      {/* زر الرجوع الاحترافي */}
      <button 
        onClick={() => router.back()}
        className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all"
      >
        <div className="p-2 glass-card rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <span className="uppercase tracking-widest text-[10px]">Back to {group}</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 italic">
          {String(tool).replace(/-/g, " ")}
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
      </div>

      {resultFiles.length === 0 ? (
        <div className={isProcessing ? "opacity-40 pointer-events-none" : ""}>
          
          {/* منطقة الرفع الزجاجية المطورة */}
          <div className="glass-card rounded-[3.5rem] p-4 shadow-2xl border-white/40 relative">
             <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-transparent pointer-events-none rounded-[3.5rem]" />
             
             <FileUploader 
               key={uploaderKey} 
               // @ts-ignore
               multiple 
               onUpload={handleStartProcessing} 
             />
          </div>

          {isProcessing && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full" />
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute top-0 left-0 border-t-4 border-transparent rounded-full" />
              </div>
              <p className="font-black text-blue-600 animate-pulse uppercase text-xs tracking-[0.3em]">
                Local Engine Processing...
              </p>
            </div>
          )}
        </div>
      ) : (
        /* واجهة النجاح الزجاجية */
        <div className="glass-card p-12 rounded-[3.5rem] text-center animate-in zoom-in duration-500 shadow-2xl border-green-500/20">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">
            Task Complete
          </h2>
          <p className="text-slate-500 font-medium mb-10 italic">Your file is processed and secured locally.</p>

          <div className="grid gap-4 max-w-sm mx-auto">
            {resultFiles.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                download={file.name}
                className="flex items-center justify-between bg-slate-900 dark:bg-blue-600 text-white px-8 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-blue-500/20 group"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm truncate max-w-37.5">{file.name}</span>
                </div>
                <Download className="w-5 h-5 animate-bounce" />
              </a>
            ))}

            <button
              onClick={resetAll}
              className="mt-8 flex items-center justify-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-[0.2em] transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset Tool
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
