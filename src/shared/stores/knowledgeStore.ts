import {Knowledge} from "../types/CourseTypes.ts";
import {create} from "zustand";
import {fetchKnowledgeTree} from "../../features/SupaBaseKnowledge.ts";

interface KnowledgeStore {
  knowledgeTree: Knowledge[] | null
  loading: boolean
  error: string | null
  fetchKnowledgeTree: () => void
}

export const useKnowledgeStore = create<KnowledgeStore>((set) => ({
  knowledgeTree: null,
  loading: false,
  error: null,

  fetchKnowledgeTree: async () => {
    try {
      set({loading: true, error: null});
      const {data, error} = await fetchKnowledgeTree();
      if (error) {
        console.error('Error fetching knowledge tree:', error.message);
        set({knowledgeTree: null, error: error.message, loading: false});
      } else {
        set({knowledgeTree: data, loading: false});
      }
    } catch (error) {
      console.error('Error fetching knowledge tree:', error);
      set({knowledgeTree: null, error: String(error), loading: false});
    }
  },
}))