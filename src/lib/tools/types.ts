export type ToolResult = {
  url: string;
  name: string;
};

export type ToolEngine = {
  label: string;
  accept: string[];
  process: (files: any[]) => Promise<ToolResult[]>;
};
