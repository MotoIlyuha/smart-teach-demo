import supabase from "../config/supabaseClient.ts";
import {AuthApiError, Session, User} from "@supabase/supabase-js";

/**
 * Авторизация по почте и паролю
 * @param email - email пользователя
 * @param password - пароль пользователя
 * @returns Promise с результатом попытки входа
 */
export const signInWithEmail = async ({email, password}: { email: string, password: string }): Promise<Awaited<{
  data: { user: User | null; session: Session | null } | { user: null; session: null }
}>> => {
  const {data, error} = await supabase.auth.signInWithPassword({email, password});
  if (error) throw error;
  return Promise.resolve({data: data});
}


interface signUpWithEmailProps {
  login: string;
  email: string;
  password: string;
}


/**
 * Регистрация по почте и паролю
 * @param login - login пользователя
 * @param email - email пользователя
 * @param password - пароль пользователя
 * @returns Promise с результатом попытки входа
 */
export const signUpWithEmail = async ({login, email, password}: signUpWithEmailProps): Promise<boolean> => {
  try {
    const {data: auth_data, error: auth_error} = await supabase.auth.signUp({email, password, options: {data: {login}}});
    if (auth_error || !auth_data || !auth_data.user) throw auth_error;
    try {
      const {error: user_error} = await supabase
        .from('users')
        .update({
          login: login
        })
        .eq('login', email);
      if (user_error) throw user_error;
      return Promise.resolve(true);
    }
    catch (e) {
      console.error(e);
      return Promise.reject(new Error('Пользователь с такой почтой уже существует'));
    }
  }
  catch (e) {
    if (e instanceof AuthApiError && e.message === "email rate limit exceeded")
      return Promise.reject(new Error('Сервер не может работать так быстро. Пожалуйста, подождите.'));
    return Promise.reject(new Error('Произошла ошибка при регистрации'));
  }
};

/**
 * Авторизация через GitHub
 * @returns Promise с результатом попытки входа через GitHub
 */
export const signInWithGitHub = async () => {
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: 'github',
  });
  if (error) {
    return [false, error];
  }
  return [true, data];
};

/**
 * Проверка существования пользователя по email
 * @param email - email для проверки
 * @returns Promise с boolean, указывающим, существует ли пользователь
 */
export const checkIfEmailExists = async (email: string) => {
  try {
    const {data} = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    console.log(!!data);
    return Promise.resolve(!!data);
  }
  catch {
    return Promise.resolve(false);
  }
};

/**
 * Проверка существования пользователя по login
 * @param login - login для проверки
 * @returns Promise с boolean, указывающим, существует ли пользователь
 */
export const checkIfLoginExists = async (login: string): Promise<boolean> => {
  try {
    const {data} = await supabase
      .from('users')
      .select('id')
      .eq('login', login)
      .single();
    console.log(!!data);
    return Promise.resolve(!!data);
  }
  catch {
    return Promise.resolve(false);
  }
};
