import {createContext, ReactNode, SetStateAction, useEffect, useState} from 'react';
import {AuthChangeEvent, Session, User} from '@supabase/supabase-js';
import {Tables} from "../types/supabase.ts";
import {getUserByEmail} from "../features/SupaBaseUsers.ts";
import supabase from '../config/supabaseClient.ts';

// create a context for authentication
export const AuthContext = createContext<{
  session: Session | null | undefined,
  user: User | null | undefined,
  person: Tables<'users'> | null | undefined,
  signOut: () => void
}>({
  session: null, user: null, person: null, signOut: () => {}
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [person, setPerson] = useState<Tables<'users'>>();
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const {data: {session}, error} = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session)
      setUser(session?.user)
      if (session?.user?.email)
        getUserByEmail(session?.user?.email).then(setPerson);
      setLoading(false);
    };

    const {data: listener} = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: SetStateAction<Session | null | undefined>) => {
      setSession(session);
      if (session && "user" in session) {
        setUser(session?.user)
      }
      setLoading(false)
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    person,
    signOut: () => {
      supabase.auth.signOut();
      setUser(undefined);
      setSession(undefined);
    },
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
