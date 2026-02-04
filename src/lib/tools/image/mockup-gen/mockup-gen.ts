export const processMockupGen = async (files: { data: File; name: string }[]) => {
  return files.map(file => ({ url: URL.createObjectURL(file.data), name: file.name }));
};
