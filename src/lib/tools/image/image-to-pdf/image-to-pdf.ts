import { UploadedFile } from "@/components/FileUploader";
import { jsPDF } from "jspdf";

/**
 * تحويل مجموعة صور إلى PDF
 */
export async function processImageToPdf(
  files: UploadedFile[],
  maxFiles = 10
): Promise<UploadedFile> {
  if (files.length === 0) throw new Error("No images selected.");
  if (files.length > maxFiles)
    throw new Error(`Maximum ${maxFiles} images allowed.`);

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // تحويل الصورة إلى Data URL (Base64)
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file.data);
    });

    // إنشاء صورة مؤقتة لتحصل على أبعادها
    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => {
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        const ratio = Math.min(pageW / img.width, pageH / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (pageW - w) / 2;
        const y = (pageH - h) / 2;

        if (i > 0) doc.addPage();
        doc.addImage(dataUrl, "JPEG", x, y, w, h);

        resolve();
      };
    });
  }

  const blob = doc.output("blob");
  return {
    url: URL.createObjectURL(blob),
    name: "images-to-pdf.pdf",
    data: new File([blob], "images-to-pdf.pdf", { type: "application/pdf" }),
  };
}
