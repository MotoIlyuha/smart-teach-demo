// userStore.ts
import {create} from 'zustand';
import {UserDetails} from "../../types/UserTypes.ts";
import {fetchUserDetails, updateUserDetails} from "../../features/SupaBaseUsers.ts";

interface UserState {
  user: UserDetails | null;
  loading: boolean;
  error: string | null;
  fetchUser: (userLogin: string | null) => void;
  updateUser: (updates: Partial<UserDetails>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  // Функция для загрузки пользователя
  fetchUser: async (userLogin: string | null) => {
    console.log("Fetching user:", userLogin);
    if (userLogin === null) set({user: null, loading: false});
    else
      try {
        set({loading: true, error: null});
        const {data, error} = await fetchUserDetails(userLogin);

        console.log("Fetched user data:", data);
        if (error) {
          console.error("Error fetching user:", error.message);
          set({user: null, error: error.message, loading: false});
        } else {
          set({user: data, loading: false});
        }
      } catch (e) {
        console.error("Unexpected error fetching user:", e);
        set({user: null, error: String(e), loading: false});
      }
  },

  // Функция для обновления пользователя
  updateUser: async (updates: Partial<UserDetails>) => {
    console.log("Updating user with:", updates);

    try {
      set((state) => ({
        user: {...state.user, ...updates} as UserDetails,
      }));

      const {user} = useUserStore.getState();

      console.log("Current user before update:", user);

      if (user) {
        const {error} = await updateUserDetails(user.id, updates);
        if (error) {
          console.error("Error updating user:", error.message);
          set({error: error.message});
        } else {
          console.log("User updated successfully");
        }
      }
    } catch (e) {
      console.error("Unexpected error updating user:", e);
      set({error: String(e)});
    }
  },
}));
