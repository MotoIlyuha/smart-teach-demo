import supabase from "../config/supabaseClient.ts";
import {Tables} from "../types/supabase.ts";

export async function getUserByEmail(email: string): Promise<Tables<'users'>> {
  const {data: user, error} = await supabase.from('users').select("*").eq('email', email).single();
  if (error || !user) {
    console.error(error);
    throw new Error(`User with email "${email}" not found`);
  }
  else return user;
}

export async function getUserByLogin(login: string): Promise<Tables<'users'>> {
  const {data: user, error} = await supabase.from('users').select("*").eq('login', login).single();
  if (error || !user) {
    console.error(error);
    throw new Error(`User with login "${login}" not found`);
  }
  else return user;
}