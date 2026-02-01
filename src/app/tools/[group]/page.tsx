"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ImageIcon, Zap, ShieldCheck, MousePointer2, Sparkles } from 'lucide-react';

// قاعدة بيانات الـ 20 أداة لمجموعة الصور
const toolsData: Record<string, any[]> = {
  image: [
    // 1. التحويل والضغط
    { id: 'image-to-pdf', name: 'Image to PDF', desc: 'Merge multiple images into one PDF.', cat: 'Convert' },
    { id: 'webp-converter', name: 'WebP Converter', desc: 'Convert PNG/JPG to WebP format.', cat: 'Convert' },
    { id: 'heic-to-jpg', name: 'HEIC to JPG', desc: 'Convert iPhone HEIC photos to JPG.', cat: 'Convert' },
    { id: 'compress-image', name: 'Compress Image', desc: 'Reduce file size without losing quality.', cat: 'Convert' },
    { id: 'image-to-icon', name: 'Image to Icon', desc: 'Generate Favicons (16x16, 32x32).', cat: 'Convert' },

    // 2. التعديل الهندسي
    { id: 'resize-image', name: 'Resize Image', desc: 'Change dimensions (Width & Height).', cat: 'Edit' },
    { id: 'square-insta', name: 'Square for Insta', desc: 'Make images square without cropping.', cat: 'Edit' },
    { id: 'flip-rotate', name: 'Flip & Rotate', desc: 'Mirror or rotate your images.', cat: 'Edit' },
    { id: 'round-corners', name: 'Round Corners', desc: 'Add smooth rounded edges to photos.', cat: 'Edit' },
    { id: 'crop-image', name: 'Crop Image', desc: 'Cut specific parts of your image.', cat: 'Edit' },

    // 3. الذكاء الاصطناعي والخصوصية
    { id: 'remove-bg', name: 'Remove Background', desc: 'Remove background using AI.', cat: 'AI' },
    { id: 'upscale-ai', name: 'AI Image Upscaler', desc: 'Enhance and enlarge low-res photos.', cat: 'AI' },
    { id: 'remove-exif', name: 'Exif Data Remover', desc: 'Delete hidden GPS & device metadata.', cat: 'Privacy' },
    { id: 'blur-data', name: 'Blur Sensitive Data', desc: 'Hide faces or private info in photos.', cat: 'Privacy' },
    { id: 'ocr-text', name: 'Image to Text', desc: 'Extract text from any scanned image.', cat: 'AI' },

    // 4. التصميم والجماليات
    { id: 'watermark', name: 'Add Watermark', desc: 'Protect images with logos or text.', cat: 'Design' },
    { id: 'color-palette', name: 'Color Palette', desc: 'Extract hex codes from any image.', cat: 'Design' },
    { id: 'filters', name: 'Photo Filters', desc: 'Apply professional artistic filters.', cat: 'Design' },
    { id: 'meme-gen', name: 'Meme Generator', desc: 'Create viral memes in seconds.', cat: 'Design' },
    { id: 'mockup-gen', name: 'Device Mockup', desc: 'Place screenshots inside iPhone/Mac frames.', cat: 'Design' },
  ]
};

export default function GroupToolsPage() {
  const params = useParams();
  const group = params.group as string;
  const tools = toolsData[group] || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-700">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            {group} <span className="text-blue-600">Studio</span>
          </h1>
        </div>
        <p className="text-slate-500 font-medium max-w-xl">
          Explore 20+ professional tools to process your {group} files locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Link href={`/tools/${group}/${tool.id}`} key={tool.id} className="group">
            <div className="glass-card p-6 rounded-3xl h-full flex flex-col hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/5 group-hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md">
                  {tool.cat}
                </span>
                <Zap className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                {tool.desc}
              </p>
              <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                Launch Tool <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
