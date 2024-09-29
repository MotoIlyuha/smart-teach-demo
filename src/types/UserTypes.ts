import {Tables} from "./supabase.ts";

export interface UserDetails extends Tables<'users'>{
  role_name: string;
  group_name: string | null;
}