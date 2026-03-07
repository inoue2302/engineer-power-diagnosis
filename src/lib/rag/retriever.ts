import { getVectorIndex } from "./vector-store";
import type { KnowledgeMetadata } from "./vector-store";

const VALID_CATEGORIES = ["frontend", "backend", "fullstack", "leadership", "learning", "infrastructure"] as const;
type ValidCategory = typeof VALID_CATEGORIES[number];

type RetrievedDocument = {
  content: string;
  metadata: KnowledgeMetadata;
  score: number;
};

const isValidCategory = (value: string): value is ValidCategory =>
  VALID_CATEGORIES.some((c) => c === value);

// ホワイトリスト検証済みの値のみを受け取るため安全だが、
// テンプレートリテラルでのフィルタ組み立てを避けマップベースにする
const CATEGORY_FILTERS: Record<ValidCategory, string> = {
  frontend: "category = 'frontend'",
  backend: "category = 'backend'",
  fullstack: "category = 'fullstack'",
  leadership: "category = 'leadership'",
  learning: "category = 'learning'",
  infrastructure: "category = 'infrastructure'",
};

const buildCategoryFilter = (category: ValidCategory): string =>
  CATEGORY_FILTERS[category];

export const retrieveKnowledge = async (
  query: string,
  category?: string,
  topK = 5
): Promise<RetrievedDocument[]> => {
  const index = getVectorIndex();
  if (!index) return [];

  const validatedCategory = category && isValidCategory(category) ? category : undefined;

  const results = await index.query<KnowledgeMetadata>({
    data: query,
    topK,
    includeMetadata: true,
    includeData: true,
    ...(validatedCategory ? { filter: buildCategoryFilter(validatedCategory) } : {}),
  });

  return results.reduce<RetrievedDocument[]>((docs, r) => {
    if (typeof r.data === "string" && r.metadata) {
      docs.push({ content: r.data, metadata: r.metadata, score: r.score });
    }
    return docs;
  }, []);
};
