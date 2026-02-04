export const processImageToIcon = async (files: { data: File; name: string }[]) => {
  const output: { url: string; name: string }[] = [];
  for (const file of files) {
    const blob = new Blob([await file.data.arrayBuffer()], { type: "image/x-icon" });
    output.push({ url: URL.createObjectURL(blob), name: file.name.replace(/\.[^/.]+$/, ".ico") });
  }
  return output;
};
