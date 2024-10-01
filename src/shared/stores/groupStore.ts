// groupStore.ts
import {create} from 'zustand';
import {fetchGroupDetails, GroupDetails, updateGroupDetails} from "../../features/SupaBaseGroups.ts";

interface GroupState {
  group: GroupDetails | null;
  loading: boolean;
  error: string | null;
  fetchGroup: (group_id: string | null) => void;
  updateGroup: (group_id: string, updates: Partial<GroupDetails>) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set) => ({
  group: null,
  loading: false,
  error: null,

  // Функция для загрузки данных о группе
  fetchGroup: async (group_id: string | null) => {
    if (!group_id) return;

    console.log("Fetching group:", group_id);
    try {
      set({ loading: true, error: null });
      const { data, error } = await fetchGroupDetails(group_id);

      console.log("Fetched group data:", data);
      if (error) {
        console.error("Error fetching group:", error.message);
        set({ group: null, error: error.message, loading: false });
      } else {
        set({ group: data, loading: false });
      }
    } catch (e) {
      console.error("Unexpected error fetching group:", e);
      set({ group: null, error: String(e), loading: false });
    }
  },

  // Функция для обновления данных о группе
  updateGroup: async (group_id: string, updates: Partial<GroupDetails>) => {
    console.log("Updating group with:", updates);

    try {
      set((state) => ({
        group: state.group ? { ...state.group, ...updates } : null,
      }));

      // Предполагается, что `updateGroupDetails` будет выполнять обновление данных в базе данных
      const { error } = await updateGroupDetails(group_id, updates);
      if (error) {
        console.error("Error updating group:", error.message);
        set({ error: error.message });
      } else {
        console.log("Group updated successfully");
      }
    } catch (e) {
      console.error("Unexpected error updating group:", e);
      set({ error: String(e) });
    }
  },
}));