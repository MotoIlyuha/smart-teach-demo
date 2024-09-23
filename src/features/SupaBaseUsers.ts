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


export async function getRole(role_id: number): Promise<Tables<'roles'>> {
  const {data: role, error} = await supabase.from('roles').select("*").eq('id', role_id).single();
  if (error || !role) {
    console.error(error);
    throw new Error(`Role with id "${role_id}" not found`);
  }
  else return role;
}