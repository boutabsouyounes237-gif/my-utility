import { PDFDocument } from "pdf-lib";
import type { UploadedFile } from "@/types/uploaded-file";

const MAX_IMAGES = 10;
const MAX_WIDTH = 2000;

async function normalizeImage(file: UploadedFile): Promise<ArrayBuffer> {
  const bitmap = await createImageBitmap(file.data);

  let { width, height } = bitmap;

  if (width > MAX_WIDTH) {
    const ratio = MAX_WIDTH / width;
    width = MAX_WIDTH;
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9)
  );

  return blob.arrayBuffer();
}

export async function processImageToPdf(
  files: UploadedFile[]
): Promise<UploadedFile> {
  if (!files.length) {
    throw new Error("No files provided.");
  }

  if (files.length > MAX_IMAGES) {
    throw new Error(`Maximum ${MAX_IMAGES} images allowed.`);
  }

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are supported.");
    }

    const bytes = await normalizeImage(file);
    const image = await pdfDoc.embedJpg(bytes);

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const file = new File([blob], "images-to-pdf.pdf", {
    type: "application/pdf",
  });

  return {
    data: file,
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(blob),
  };
}
