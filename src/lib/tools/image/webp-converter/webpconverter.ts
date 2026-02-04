export const processWebpConverter = async (files: { data: File; name: string }[]) => {
  const processed: { url: string; name: string }[] = [];
  for (const file of files) {
    const img = await file.data.arrayBuffer();
    const blob = new Blob([img], { type: "image/webp" });
    processed.push({ url: URL.createObjectURL(blob), name: file.name.split(".")[0] + ".webp" });
  }
  return processed;
};
