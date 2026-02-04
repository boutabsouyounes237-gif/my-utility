import "./globals.css";

import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="grow">{children}</main>
      </body>
    </html>
  );
}
