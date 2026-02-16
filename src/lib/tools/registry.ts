import type { UploadedFile } from "@/types/uploaded-file";
import { processImageToPdf } from "./image/image-to-pdf";
import { processWebpConverter } from "./image/webp-converter";
import { processHeicToJpg } from "./image/heic-to-jpg";
import { processCompressImage } from "./image/compress-image";
import { processImageToIcon } from "./image/image-to-icon";
import { processResizeImage } from "./image/resize-image";
import { processSquareInsta } from "./image/square-insta";
import { processFlipRotate } from "./image/flip-rotate";
import { processRoundCorners } from "./image/round-corners";
import { processCropImage } from "./image/crop-image";
import { processRemoveBg } from "./image/remove-bg";
import { processUpscaleAi } from "./image/upscale-ai";
import { processRemoveExif } from "./image/remove-exif";
import { processBlurData } from "./image/blur-data";
import { processOcrText } from "./image/ocr-text";
import { processStyleTransfer } from "./image/style-transfer";
import { processWatermark } from "./image/watermark";
import { processColorPalette } from "./image/color-palette";
import { processFilters } from "./image/filters";
import { processMemeGen } from "./image/meme-gen";
import { processMockupGen } from "./image/mockup-gen";

export type ToolProcessor = (
  files: UploadedFile[]
) => Promise<UploadedFile | UploadedFile[]>;

export const IMAGE_TOOLS_PROCESSORS = {
  "image-to-pdf": processImageToPdf,
  "webp-converter": processWebpConverter,
  "heic-to-jpg": processHeicToJpg,
  "compress-image": processCompressImage,
  "image-to-icon": processImageToIcon,
  "resize-image": processResizeImage,
  "square-insta": processSquareInsta,
  "flip-rotate": processFlipRotate,
  "round-corners": processRoundCorners,
  "crop-image": processCropImage,
  "remove-bg": processRemoveBg,
  "upscale-ai": processUpscaleAi,
  "remove-exif": processRemoveExif,
  "blur-data": processBlurData,
  "ocr-text": processOcrText,
  "style-transfer": processStyleTransfer,
  "watermark": processWatermark,
  "color-palette": processColorPalette,
  "filters": processFilters,
  "meme-gen": processMemeGen,
  "mockup-gen": processMockupGen,
} as const;

export type ImageToolKey = keyof typeof IMAGE_TOOLS_PROCESSORS;
