import supabase from "../config/supabaseClient.ts";
import {Tables} from "../types/supabase.ts";

export async function getUserByEmail(email: string): Promise<Tables<'users'>> {
  const {data: user, error} = await supabase.from('users').select("*").eq('email', "motoilyuha@mail.ru").single();
  if (error || !user) {
    console.error(error);
    throw new Error(`User with email "${email}" not found`);
  }
  else return user;
}