import { PDFDocument } from "pdf-lib";

export type UploadedFile = {
  data: File;
  name: string;
  url?: string;
};

export async function imagesToPdf(files: UploadedFile[]): Promise<UploadedFile> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.data.arrayBuffer();
    const imageType = file.name.endsWith(".png") ? "png" : "jpeg";

    let pdfImage;
    if (imageType === "png") {
      pdfImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      pdfImage = await pdfDoc.embedJpg(arrayBuffer);
    }

    const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
    page.drawImage(pdfImage, {
      x: 0,
      y: 0,
      width: pdfImage.width,
      height: pdfImage.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  return {
    data: new File([blob], "images-to-pdf.pdf", { type: "application/pdf" }),
    name: "images-to-pdf.pdf",
    url,
  };
}
