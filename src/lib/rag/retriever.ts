import { getVectorIndex } from "./vector-store";
import type { KnowledgeMetadata } from "./vector-store";

type RetrievedDocument = {
  content: string;
  metadata: KnowledgeMetadata;
  score: number;
};

export const retrieveKnowledge = async (
  query: string,
  category?: string,
  topK = 5
): Promise<RetrievedDocument[]> => {
  const index = getVectorIndex();
  if (!index) return [];

  const results = await index.query<KnowledgeMetadata>({
    data: query,
    topK,
    includeMetadata: true,
    includeData: true,
    ...(category ? { filter: `category = '${category}'` } : {}),
  });

  return results
    .filter((r) => r.metadata && r.data)
    .map((r) => ({
      content: r.data as string,
      metadata: r.metadata as KnowledgeMetadata,
      score: r.score,
    }));
};
