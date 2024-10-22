import {Knowledge} from "../types/CourseTypes.ts";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {devtools} from "zustand/middleware";
import {fetchKnowledgeTree} from "../../features/SupaBaseKnowledge.ts";

interface KnowledgeStore {
  loading: boolean
  error: string | null
  knowledgeList: Knowledge[] | null | undefined
  knowledgeTree: Knowledge[] | null | undefined
  fetchKnowledgeTree: (user_id?: string, admin_mode?: boolean) => void
}

export const useKnowledgeStore = create<KnowledgeStore>()((devtools(immer((set) => ({
  knowledgeTree: null,
  knowledgeList: null,
  loading: false,
  error: null,

  fetchKnowledgeTree: async (user_id?: string, admin_mode?: boolean) => {
    try {
      set({loading: true, error: null});
      const {tree, list, error} = await fetchKnowledgeTree(user_id, admin_mode);
      if (error) {
        console.error('Error fetching knowledge tree:', error.message);
        set({knowledgeTree: null, knowledgeList: null, error: error.message, loading: false});
      } else {
        set({knowledgeTree: tree, knowledgeList: list, loading: false});
      }
    } catch (error) {
      console.error('Error fetching knowledge tree:', error);
      set({knowledgeTree: null, error: String(error), loading: false});
    }
  },
})))))