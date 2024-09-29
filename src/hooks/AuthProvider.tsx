// AuthProvider.tsx
import {createContext, ReactNode, useEffect, useState} from 'react';
import {AuthChangeEvent, Session, User} from '@supabase/supabase-js';
import {fetchUserDetails} from '../features/SupaBaseUsers';
import supabase from '../config/supabaseClient';
import {useAuthStore} from "../shared/stores/authStore.ts";
import {UserDetails} from "../types/UserTypes.ts";

// Создаем контекст для аутентификации
export const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  person: UserDetails | null;
  loading: boolean;
  signOut: () => void;
}>({
  session: null,
  user: null,
  person: null,
  loading: true,
  signOut: () => {
  },
});

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const {user, session, person, setSession, setUser, setPerson} = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async (): Promise<{session: Session, user: User, person: UserDetails}> => {
      const {data: {session}, error} = await supabase.auth.getSession();
      if (error) throw error;

      setUser(session?.user || null);

      if (session?.user?.email) {
        const {data: user_login, error} = await supabase.from('users').select('login').eq('id', session.user.id).single();
        if (error) throw error;
        const {data: person_data, error: fetch_error} = await fetchUserDetails(user_login.login);
        if (fetch_error || !person_data) throw fetch_error;
        setLoading(false);
        return {session: session, user: session.user, person: person_data}
      } else throw new Error("No person");
    };

    const {data: listener} = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setData()
        .then(({user, person}) => {
          setSession(session);
          setUser(user);
          setPerson(person);
        })
        .catch(e => console.error(e));
    });

    setData()
      .then(({session, user, person}) => {
      setSession(session);
      setUser(user);
      setPerson(person);
    })
      .catch(e => console.error(e));

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [setPerson, setSession, setUser]);

  const value = {
    session: session || null,
    user: user || null,
    person: person || null,
    loading: loading,
    signOut: () => {
      supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setPerson(null);
    },
  };

  // Используем провайдер для передачи значения
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
