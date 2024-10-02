import { createContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { fetchUserDetails } from '../features/SupaBaseUsers';
import supabase from '../config/supabaseClient';
import { useAuthStore } from "../shared/stores/authStore.ts";
import { UserDetails } from "../shared/types/UserTypes.ts";

interface AuthContextProps {
  session: Session | null; // Убираем возможность undefined
  user: User | null; // Убираем возможность undefined
  person: UserDetails | null; // Убираем возможность undefined
  loading: boolean;
  signOut: () => void;
}

// Создаем контекст для аутентификации
export const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  person: null,
  loading: true,
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, person, setSession, setUser, setPerson } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Оборачиваем setData в useCallback
  const setData = useCallback(async (session: Session | null) => {
    setLoading(true);

    // Если сессия есть, получаем дополнительные данные о пользователе
    if (session?.user?.id) {
      try {
        const { data: user_login, error: loginError } = await supabase
          .from('users')
          .select('login')
          .eq('id', session.user.id)
          .single();

        if (loginError) throw loginError;

        const { data: person_data, error: fetchError } = await fetchUserDetails(user_login.login);
        if (fetchError || !person_data) throw fetchError;

        // Обновляем состояние в хранилище
        setSession(session);
        setUser(session.user);
        setPerson(person_data);
      } catch (e) {
        console.error("Error fetching user details:", e);
        setUser(null);
        setPerson(null);
      }
    } else {
      // Если нет сессии, сбрасываем состояние
      setSession(null);
      setUser(null);
      setPerson(null);
    }

    setLoading(false);
  }, [setSession, setUser, setPerson]);

  useEffect(() => {
    // Получаем текущую сессию при первом рендере
    const initSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Error fetching session:", error);
      await setData(session ?? null); // Передаем null, если session undefined
    };

    // Подписываемся на изменения сессии
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setData(session ?? null); // Передаем null, если session undefined
      }
    );

    initSession();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [setData]);

  const value: AuthContextProps = {
    session: session || null,
    user: user || null,
    person: person || null,
    loading,
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
