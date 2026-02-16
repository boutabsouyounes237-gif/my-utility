import type { UploadedFile } from "@/types/uploaded-file";

const MAX_IMAGES = 10;
const MAX_WIDTH = 2000;

async function convertToWebp(file: UploadedFile): Promise<UploadedFile> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are supported.");
  }

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
    canvas.toBlob((b) => resolve(b!), "image/webp", 0.9)
  );

  const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
  const webpFile = new File([blob], newName, { type: "image/webp" });

  return {
    data: webpFile,
    name: webpFile.name,
    size: webpFile.size,
    type: webpFile.type,
    url: URL.createObjectURL(blob),
  };
}

export async function processWebpConverter(
  files: UploadedFile[]
): Promise<UploadedFile[]> {
  if (!files.length) {
    throw new Error("No files provided.");
  }

  if (files.length > MAX_IMAGES) {
    throw new Error(`Maximum ${MAX_IMAGES} images allowed.`);
  }

  const results: UploadedFile[] = [];

  for (const file of files) {
    const converted = await convertToWebp(file);
    results.push(converted);
  }

  return results;
}
