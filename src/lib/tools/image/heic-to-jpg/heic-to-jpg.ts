export const processHeicToJpg = async (files: { data: File; name: string }[]) => {
  const output: { url: string; name: string }[] = [];
  for (const file of files) {
    const blob = new Blob([await file.data.arrayBuffer()], { type: "image/jpeg" });
    output.push({ url: URL.createObjectURL(blob), name: file.name.replace(/\.[^/.]+$/, ".jpg") });
  }
  return output;
};
