export const processFilters = async (files: { data: File; name: string }[]) => {
  return files.map(file => ({ url: URL.createObjectURL(file.data), name: file.name }));
};
