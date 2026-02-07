import { PDFDocument } from "pdf-lib";
import type { UploadedFile } from "@/types/uploaded-file";

const MAX_IMAGES = 10; // الحد الأقصى للصور

export async function processImageToPdf(files: UploadedFile[]): Promise<UploadedFile> {
  if (files.length > MAX_IMAGES) {
    throw new Error(`You can only convert up to ${MAX_IMAGES} images at a time.`);
  }

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    // تحويل الملف إلى ArrayBuffer
    const bytes = await file.data.arrayBuffer();

    // تحويل أي صورة إلى PNG باستخدام Canvas
    const imgBitmap = await createImageBitmap(new Blob([bytes], { type: file.type }));
    const canvas = document.createElement("canvas");
    canvas.width = imgBitmap.width;
    canvas.height = imgBitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgBitmap, 0, 0);

    // تحويل Canvas إلى ArrayBuffer PNG
    const pngBlob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    const pngBytes = await pngBlob.arrayBuffer();

    const pdfImage = await pdfDoc.embedPng(pngBytes);
    const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
    page.drawImage(pdfImage, { x: 0, y: 0, width: pdfImage.width, height: pdfImage.height });
  }

  const pdfBytes = await pdfDoc.save();
 const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf", });
  const pdfFile = new File([blob], "images-to-pdf.pdf", { type: "application/pdf" });

  return {
    data: pdfFile,
    file: pdfFile,
    name: pdfFile.name,
    size: pdfFile.size,
    type: pdfFile.type,
    url: URL.createObjectURL(blob),
  };
}
