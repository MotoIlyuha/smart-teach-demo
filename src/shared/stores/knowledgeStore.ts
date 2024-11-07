import {Knowledge} from "../types/CourseTypes.ts";
import {create} from "zustand";
import {
  createKnowledge,
  deleteKnowledge,
  fetchKnowledgeTree,
  updateKnowledge
} from "../../features/SupaBaseKnowledge.ts";
import {useAuthStore} from "./authStore.ts";

const handleCreateKnowledge = (tree: Knowledge[], knowledge: Knowledge, parentId: string | null): Knowledge[] => {
  if (parentId === null) {
    return [...tree, knowledge];
  }
  return tree.map((node) => {
    if (node.id === parentId) {
      // Добавляем новый узел как дочерний элемент к узлу с parentId
      const updatedChildren = node.children ? [...node.children, knowledge] : [knowledge];
      return {
        ...node,
        children: updatedChildren,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: handleCreateKnowledge(node.children, knowledge, parentId),
      };
    }
    return node;
  });
};

const handleEditKnowledge = (tree: Knowledge[], key: string, updatedData: Partial<Knowledge>): Knowledge[] => {
  return tree.map((node) => {
    if (node.id === key) {
      return {
        ...node,
        ...updatedData,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: handleEditKnowledge(node.children, key, updatedData),
      };
    }
    return node;
  });
};

const handleDeleteKnowledge = (tree: Knowledge[], key: string): Knowledge[] => {
  return tree
    .filter((node) => node.id !== key) // Удаляем узел, если его id совпадает с key
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: handleDeleteKnowledge(node.children, key),
        };
      }

      return node;
    });
};

interface KnowledgeStore {
  loading: boolean
  error: string | null
  knowledgeList: Knowledge[] | null | undefined
  knowledgeTree: Knowledge[] | null | undefined
  fetchKnowledgeTree: (user_id?: string, admin_mode?: boolean) => void
  createKnowledge: (knowledge: Knowledge) => void
  updateKnowledge: (knowledge_id: string, updates: Partial<Knowledge>) => void
  deleteKnowledge: (knowledge_id: string) => void
}

export const useKnowledgeStore = create<KnowledgeStore>((set) => ({
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

  createKnowledge: async (knowledge: Knowledge) => {
    set({error: null});
    console.log("Creating knowledge:", knowledge);
    try {
      const {user} = useAuthStore.getState();
      if (!user) {
        console.error('User not found');
        set({error: 'User not found'});
        return;
      }
      const error = await createKnowledge(knowledge, user.id);
      if (error) {
        console.error('Error creating knowledge:', error.message);
        set({error: error.message});
      } else {
        const {knowledgeTree, knowledgeList} = useKnowledgeStore.getState();
        if (!knowledgeTree || !knowledgeList) {
          set({error: 'Knowledge tree/list not found'});
          return;
        } else if (!knowledge.parentId) return;
        set({
          knowledgeTree: handleCreateKnowledge(knowledgeTree, knowledge, knowledge.parentId),
          knowledgeList: [...knowledgeList, knowledge]
        });
        console.log("Knowledge created successfully");
      }
    } catch (error) {
      console.error('Error creating knowledge:', error);
      set({error: String(error), loading: false});
    }
  },

  updateKnowledge: async (knowledge_id: string, updates: Partial<Knowledge>) => {
    set({error: null});
    try {
      const {user} = useAuthStore.getState();
      if (!user) {
        set({error: 'User not found'});
        return;
      }
      const error = await updateKnowledge(knowledge_id, updates, user.id);
      if (error) {
        console.error('Error updating knowledge:', error.message);
        set({error: error.message});
      } else {
        const {knowledgeTree, knowledgeList} = useKnowledgeStore.getState();
        if (!knowledgeTree || !knowledgeList) {
          set({error: 'Knowledge tree/list not found'});
          return;
        }
        set({
          knowledgeTree: handleEditKnowledge(knowledgeTree, knowledge_id, updates),
          knowledgeList: knowledgeList.map(k => k.id === knowledge_id ? {...k, ...updates} : k)
        });
      }
    } catch (error) {
      console.error('Error updating knowledge:', error);
      set({error: String(error)});
    }
  },

  deleteKnowledge: async (knowledge_id: string) => {
    set({error: null});
    console.log("Deleting knowledge:", knowledge_id);
    try {
      const {user} = useAuthStore.getState();
      if (!user) {
        console.error('User not found');
        set({error: 'User not found'});
        return;
      }
      const error = await deleteKnowledge(knowledge_id, user.id);
      if (error) {
        console.error('Error deleting knowledge:', error.message);
        set({error: error.message});
      } else {
        const {knowledgeTree, knowledgeList} = useKnowledgeStore.getState();
        if (!knowledgeTree || !knowledgeList) {
          set({error: 'Knowledge tree/list not found'});
          return;
        }
        set({
          knowledgeTree: handleDeleteKnowledge(knowledgeTree, knowledge_id),
          knowledgeList: knowledgeList.filter(k => k.id !== knowledge_id)
        });
      }
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      set({error: String(error)});
    }
  }
}));