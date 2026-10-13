export interface Document {
  image: { url: string; alt: string };
}

export type RawDocument = { name: string; doc: { asset: { url: string } } };
