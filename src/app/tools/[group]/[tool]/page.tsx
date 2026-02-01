"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import FileUploader from '@/components/FileUploader';
import { jsPDF } from "jspdf";
// @ts-ignore
import confetti from 'canvas-confetti';
import { Download, CheckCircle2, RefreshCw, Loader2, Image as ImageIcon } from 'lucide-react';

export default function SingleToolPage() {
  const { group, tool } = useParams();
  const [resultFiles, setResultFiles] = useState<{url: string, name: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const handleStartProcessing = async (files: any[]) => {
    setIsProcessing(true);
    try {
      if (tool === 'image-to-pdf') {
        await processImageToPdf(files);
      } else if (tool === 'webp-converter') {
        await processToWebp(files);
      }
    } catch (error) {
      console.error("Processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- محرك تحويل WebP ---
  const processToWebp = async (files: any[]) => {
    const processed: {url: string, name: string}[] = [];

    for (const file of files) {
      const img = new Image();
      img.src = URL.createObjectURL(file.data);

      await new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          
          // تحويل الصورة إلى WebP بجودة 80%
          canvas.toBlob((blob) => {
            if (blob) {
              processed.push({
                url: URL.createObjectURL(blob),
                name: file.name.split('.')[0] + '.webp'
              });
            }
            resolve(null);
          }, 'image/webp', 0.8);
        };
      });
    }

    setResultFiles(processed);
    confetti({ particleCount: 150, spread: 70 });
  };

  // --- محرك PDF السابق (للتذكير) ---
  const processImageToPdf = async (files: any[]) => {
    const doc = new jsPDF();
    // ... (كود PDF الذي كتبناه سابقاً)
    // في النهاية نضع النتيجة في resultFiles
    const blob = doc.output('blob');
    setResultFiles([{ url: URL.createObjectURL(blob), name: 'merged-result.pdf' }]);
    confetti({ particleCount: 150, spread: 70 });
  };

  const resetAll = () => {
    setResultFiles([]);
    setUploaderKey(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          {String(tool).replace(/-/g, ' ')}
        </h1>
      </div>

      {resultFiles.length === 0 ? (
        <div className={isProcessing ? "opacity-40 pointer-events-none" : ""}>
          <FileUploader 
            key={uploaderKey}
            allowedTypes={['image/*']} 
            onProcess={handleStartProcessing} 
          />
          {isProcessing && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="font-bold text-blue-600 animate-pulse uppercase text-xs tracking-widest">Converting to WebP...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-10 rounded-[3rem] text-center animate-in zoom-in duration-500">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Files Processed Successfully!</h2>
          
          <div className="grid gap-3 max-w-md mx-auto">
            {resultFiles.map((file, idx) => (
              <a key={idx} href={file.url} download={file.name} 
                 className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all group">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm truncate max-w-45">{file.name}</span>
                </div>
                <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            ))}
            
            <button onClick={resetAll} className="mt-6 flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors">
              <RefreshCw className="w-4 h-4" /> Start New Conversion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
