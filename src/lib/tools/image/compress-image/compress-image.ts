import type { UploadedFile } from "@/types/uploaded-file";

const MAX_IMAGES = 10;
const MAX_WIDTH = 2000;
const JPEG_QUALITY = 0.7;
const WEBP_QUALITY = 0.75;

async function compressSingleImage(file: UploadedFile): Promise<UploadedFile> {
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

  let outputType = file.type;
  let quality: number | undefined = undefined;

  if (file.type === "image/jpeg" || file.type === "image/jpg") {
    quality = JPEG_QUALITY;
  } else if (file.type === "image/webp") {
    quality = WEBP_QUALITY;
  } else if (file.type === "image/png") {
    outputType = "image/png";
  } else {
    outputType = "image/jpeg";
    quality = JPEG_QUALITY;
  }

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob(
      (b) => resolve(b!),
      outputType,
      quality
    )
  );

  const compressedFile = new File([blob], file.name, {
    type: outputType,
  });

  return {
    data: compressedFile,
    name: compressedFile.name,
    size: compressedFile.size,
    type: compressedFile.type,
    url: URL.createObjectURL(blob),
  };
}

export async function processCompressImage(
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
    const compressed = await compressSingleImage(file);
    results.push(compressed);
  }

  return results;
}
