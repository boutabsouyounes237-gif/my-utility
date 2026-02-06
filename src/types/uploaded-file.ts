export type UploadedFile = {
  data: File;   // الملف نفسه
  file?: File;  // اختياري
  name: string;
  size: number;
  type: string; // إلزامي
  url?: string;
};
