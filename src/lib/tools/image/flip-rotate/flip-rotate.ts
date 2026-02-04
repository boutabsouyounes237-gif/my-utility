export const processFlipRotate = async (files: { data: File; name: string }[]) => {
  return files.map(file => ({ url: URL.createObjectURL(file.data), name: file.name }));
};
