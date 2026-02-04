import { jsPDF } from "jspdf";

export const processImageToPdf = async (files: { data: File; name: string }[]) => {
  const doc = new jsPDF();
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imgData = await file.data.arrayBuffer();
    const blob = new Blob([imgData]);
    const url = URL.createObjectURL(blob);
    doc.addImage(url, "JPEG", 10, 10, 180, 160);
    if (i < files.length - 1) doc.addPage();
  }
  const blob = doc.output("blob");
  return [{ url: URL.createObjectURL(blob), name: "merged-result.pdf" }];
};
