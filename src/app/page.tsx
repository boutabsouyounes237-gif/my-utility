import Link from 'next/link';
import { ImageIcon, FileText, Video, Type, ShieldCheck, ArrowRight } from 'lucide-react';

const toolGroups = [
  { id: 'image', name: 'Images', desc: 'Optimize, resize and convert images.', icon: <ImageIcon />, bg: 'bg-blue-600' },
  { id: 'pdf', name: 'PDF', desc: 'Merge, split and compress documents.', icon: <FileText />, bg: 'bg-rose-600' },
  { id: 'video', name: 'Video', desc: 'Media transcoding and optimization.', icon: <Video />, bg: 'bg-violet-600' },
  { id: 'text', name: 'Text', desc: 'Analysis and content formatting tools.', icon: <Type />, bg: 'bg-emerald-600' },
  { id: 'security', name: 'Security', desc: 'Privacy-focused encryption vault.', icon: <ShieldCheck />, bg: 'bg-slate-700' },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4 tracking-tighter">
          Every tool you need in <span className="text-blue-600">one place.</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
          Every tool you need in one platform and all are 100% free and easy to use.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {toolGroups.map((group) => (
          <Link href={`/tools/${group.id}`} key={group.id} className="group">
            <div className="glass-card h-full p-8 rounded-[2.5rem] flex flex-col items-center text-center transition-all hover:-translate-y-2">
              <div className={`mb-6 p-4 rounded-3xl text-white shadow-lg ${group.bg} group-hover:scale-110 transition-transform`}>
                {group.icon}
              </div>
              <h2 className="text-xl font-bold mb-3">{group.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {group.desc}
              </p>
              <ArrowRight className="mt-8 w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-x-2.5 group-hover:translate-x-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
