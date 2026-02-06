import { PDFDocument } from "pdf-lib";
import type { UploadedFile } from "@/types/uploaded-file";

export async function processImageToPdf(files: UploadedFile[]): Promise<UploadedFile> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.data.arrayBuffer();

    let image;
    if (file.type === "image/png") {
      image = await pdfDoc.embedPng(bytes);
    } else {
      image = await pdfDoc.embedJpg(bytes);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], {
  type: "application/pdf",
});

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
