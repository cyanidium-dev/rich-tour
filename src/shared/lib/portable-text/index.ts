export type PortableTextBlock = {
  _key?: string;
  _type: string;
  children?: Array<{ text?: string; _type?: string; _key?: string; marks?: string[] }>;
  level?: number;
  listItem?: string;
  [key: string]: unknown;
};
