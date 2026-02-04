export const processCompressImage = async (files: { data: File; name: string }[]) => {
  const output: { url: string; name: string }[] = [];
  for (const file of files) {
    const blob = new Blob([await file.data.arrayBuffer()], { type: file.data.type });
    output.push({ url: URL.createObjectURL(blob), name: file.name });
  }
  return output;
};
