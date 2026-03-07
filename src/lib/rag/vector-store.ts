import { Index } from "@upstash/vector";

export type KnowledgeMetadata = {
  category: string;
  title: string;
  source: string;
};

let indexInstance: Index<KnowledgeMetadata> | null = null;

export const getVectorIndex = (): Index<KnowledgeMetadata> | null => {
  if (indexInstance) return indexInstance;

  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!url || !token) return null;

  indexInstance = new Index<KnowledgeMetadata>({ url, token });
  return indexInstance;
};
