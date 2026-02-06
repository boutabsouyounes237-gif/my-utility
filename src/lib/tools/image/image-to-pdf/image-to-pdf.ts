import { PDFDocument } from "pdf-lib";

export type UploadedFile = {
  data: File;
  name: string;
  type: string;
  url?: string;
};

export async function processImageToPdf(
  files: UploadedFile[]
): Promise<UploadedFile> {
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

  // ✅ التحويل الصحيح 100%
  const uint8 = new Uint8Array(pdfBytes);
  const blob = new Blob([uint8.buffer], {
    type: "application/pdf",
  });

  const file = new File([blob], "images-to-pdf.pdf", {
    type: "application/pdf",
  });

  return {
    data: file,
    name: file.name,
    type: file.type,
    url: URL.createObjectURL(blob),
  };
}
