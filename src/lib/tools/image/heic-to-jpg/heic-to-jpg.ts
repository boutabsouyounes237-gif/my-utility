import heic2any from "heic2any";
import type { UploadedFile } from "@/types/uploaded-file";

const MAX_IMAGES = 10;
const MAX_WIDTH = 2000;

async function convertHeicToJpg(file: UploadedFile): Promise<UploadedFile> {
  if (
    file.type !== "image/heic" &&
    file.type !== "image/heif" &&
    !file.name.toLowerCase().endsWith(".heic")
  ) {
    throw new Error("Only HEIC files are supported.");
  }

  const convertedBlob = (await heic2any({
    blob: file.data,
    toType: "image/jpeg",
    quality: 0.9,
  })) as Blob;

  const bitmap = await createImageBitmap(convertedBlob);

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

  const finalBlob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9)
  );

  const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
  const jpgFile = new File([finalBlob], newName, { type: "image/jpeg" });

  return {
    data: jpgFile,
    name: jpgFile.name,
    size: jpgFile.size,
    type: jpgFile.type,
    url: URL.createObjectURL(finalBlob),
  };
}

export async function processHeicToJpg(
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
    const converted = await convertHeicToJpg(file);
    results.push(converted);
  }

  return results;
}
