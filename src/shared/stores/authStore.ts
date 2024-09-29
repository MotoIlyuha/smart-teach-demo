// authStore.ts
import {create} from 'zustand';
import {Session, User} from '@supabase/supabase-js';
import {UserDetails} from "../../types/UserTypes.ts";

interface AuthState {
  session: Session | undefined | null;
  user: User | undefined | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  person: UserDetails | undefined | null;
  setPerson: (person: UserDetails | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  person: null,
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setPerson: (person) => set({person})
}));
