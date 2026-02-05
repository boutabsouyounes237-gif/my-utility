import { UploadedFile } from "@/components/FileUploader";
import { jsPDF } from "jspdf";

/**
 * معالجة مجموعة من الصور وتحويلها إلى PDF.
 * @param files مصفوفة الصور المراد تحويلها
 * @param maxFiles الحد الأقصى لعدد الصور (default 10)
 * @returns UploadedFile مع رابط التحميل
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

    // تحويل الملف إلى Data URL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file.data);
    });

    const img = new Image();
    img.src = dataUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // الحفاظ على نسبة الأبعاد
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        if (i > 0) doc.addPage();
        const ext = file.name.split(".").pop()?.toLowerCase();
        const type = ext === "png" || ext === "webp" ? "PNG" : "JPEG";
        doc.addImage(dataUrl, type, x, y, imgWidth, imgHeight);

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
