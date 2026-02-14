"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import { IMAGE_TOOLS_PROCESSORS } from "@/lib/tools/registry";
import type { UploadedFile } from "@/types/uploaded-file";
// @ts-ignore
import confetti from "canvas-confetti";
import { Download, CheckCircle2, RefreshCw, Loader2, Image as ImageIcon, ArrowLeft } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Bouton Retour Premium */}
      <button 
        onClick={() => router.back()}
        className="group mb-12 flex items-center gap-4 text-slate-400 hover:text-blue-600 transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-translate-x-2">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Retour au</span>
          <span className="text-sm font-bold capitalize">Studio {group}</span>
        </div>
      </button>

      {/* Titre avec Style Identité Forte */}
      <div className="text-left mb-12 border-l-8 border-blue-600 pl-8 relative">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic leading-none">
          {String(tool).replace(/-/g, " ")}
        </h1>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] opacity-60">
          Moteur Professionnel • Traitement Local Sécurisé
        </p>
      </div>

      {resultFiles.length === 0 ? (
        <div className={isProcessing ? "opacity-30 pointer-events-none transition-opacity" : ""}>
          
          {/* Zone de Téléchargement "Solid Glass" */}
          <div className="glass-card rounded-[3.5rem] p-10 shadow-2xl border-white/40 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 text-center">
              <p className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">
                Ou cliquez ci-dessous pour parcourir
              </p>
              
              <div className="inline-block w-full">
                <FileUploader key={uploaderKey} multiple onUpload={handleStartProcessing} />
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="mt-16 flex flex-col items-center gap-6">
              <div className="p-6 bg-blue-600 rounded-4xl shadow-2xl shadow-blue-500/40">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
              <p className="font-black text-blue-600 animate-pulse uppercase text-xs tracking-[0.4em]">
                Traitement en cours...
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Interface de Succès Royale */
        <div className="glass-card p-16 rounded-[4.5rem] text-center animate-in zoom-in duration-700 shadow-2xl border-green-500/10 bg-white/90 dark:bg-slate-900/90">
          <div className="w-24 h-24 bg-green-500 rounded-4xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30 rotate-6 hover:rotate-0 transition-transform duration-500">
            <CheckCircle2 className="w-12 h-12 text-white -rotate-6 transition-transform" />
          </div>
          
          <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter italic">
            Traitement Terminé
          </h2>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto mb-12 rounded-full" />

          <div className="grid gap-4 max-w-sm mx-auto">
            {resultFiles.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                download={file.name}
                className="flex items-center justify-between bg-slate-900 dark:bg-blue-600 text-white px-8 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 dark:hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-4 text-left">
                  <ImageIcon className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="truncate max-w-40">{file.name}</span>
                </div>
                <Download className="w-5 h-5 animate-bounce" />
              </a>
            ))}

            <button
              onClick={resetAll}
              className="mt-10 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-[0.4em] transition-all flex items-center justify-center gap-4 hover:gap-6"
            >
              <RefreshCw className="w-4 h-4" /> Nouvelle Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
