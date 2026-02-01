"use client";
import Link from "next/link";
import { Search, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  return (
    <nav className="w-full px-6 py-6">
      <div className="max-w-7xl mx-auto glass-card rounded-full px-8 py-3 flex items-center gap-8 shadow-lg">
        <Link href="/" className="text-xl font-black shrink-0">
          <span className="text-blue-600">CORE</span>
          <span className="text-slate-900 dark:text-white transition-colors">TOOLS</span>
        </Link>
        <div className="flex-1 relative max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search..." className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full py-1.5 pl-9 pr-4 text-sm outline-none" />
        </div>
        <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
          {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </nav>
  );
}
