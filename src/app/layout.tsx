import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://releases.transloadit.com" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">{children}</main>
      </body>
    </html>
  );
}
