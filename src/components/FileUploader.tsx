"use client";
import React, { useState, useRef } from 'react';
import { HardDrive, Cloud, Link as LinkIcon, UploadCloud, FileIcon, X, CheckCircle2 } from 'lucide-react';

interface Props {
  allowedTypes: string[];
  onProcess: (files: any[]) => void;
}

export default function FileUploader({ allowedTypes, onProcess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // معالجة اختيار الملفات
  const handleFileAction = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(file => 
      allowedTypes.some(type => file.type.match(type.replace('*', '.*')))
    );
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startProcessing = () => {
    // نرسل الملفات بتنسيق يتوافق مع الكود السابق (data property)
    const formattedFiles = selectedFiles.map(file => ({
      data: file,
      name: file.name
    }));
    onProcess(formattedFiles);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* منطقة الـ Drag & Drop الاحترافية */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFileAction(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`glass-card rounded-[3.5rem] h-65 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all duration-500 relative overflow-hidden ${
          dragActive ? "border-blue-500 bg-blue-500/10 scale-[0.98]" : "border-blue-500/20 hover:border-blue-500/50"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept={allowedTypes.join(',')} 
          onChange={(e) => handleFileAction(e.target.files)} 
        />
        
        <div className="bg-blue-600 p-6 rounded-[2.2rem] mb-5 shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          Drag & Drop
        </h2>
        <p className="text-slate-400 text-[11px] font-bold mt-2 tracking-[0.3em] uppercase">
          {selectedFiles.length > 0 ? `${selectedFiles.length} Files Selected` : "Click to browse local files"}
        </p>
      </div>

      {/* قائمة الملفات المختارة بتصميم زجاجي ناعم */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
           <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
             {selectedFiles.map((file, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 glass-card rounded-2xl mb-2 border-white/60">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg">
                     <FileIcon className="w-4 h-4 text-blue-600" />
                   </div>
                   <span className="text-sm font-bold truncate max-w-75">{file.name}</span>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-full transition-colors">
                   <X className="w-4 h-4" />
                 </button>
               </div>
             ))}
           </div>
           
           <button 
             onClick={startProcessing}
             className="w-full bg-blue-600 text-white py-5 rounded-4xlnt-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
           >
             <CheckCircle2 className="w-5 h-5" /> Start Processing
           </button>
        </div>
      )}

      {/* أزرار المصادر السفلية (كأيقونات توضيحية حالياً) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 p-6 glass-card rounded-4xl hover:bg-blue-600 hover:text-white transition-all group">
          <HardDrive className="w-6 h-6 text-blue-500 group-hover:text-white" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Device</span>
        </button>

        <button disabled className="flex flex-col items-center gap-2 p-6 glass-card rounded-4xl opacity-40 cursor-not-allowed grayscale">
          <Cloud className="w-6 h-6 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-tighter">G-Drive</span>
        </button>

        <button disabled className="flex flex-col items-center gap-2 p-6 glass-card rounded-4xl opacity-40 cursor-not-allowed grayscale">
          <Cloud className="w-6 h-6 text-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Dropbox</span>
        </button>

        <button disabled className="flex flex-col items-center gap-2 p-6 glass-card rounded-4xl opacity-40 cursor-not-allowed grayscale">
          <LinkIcon className="w-6 h-6 text-rose-500" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Link</span>
        </button>
      </div>
    </div>
  );
}
