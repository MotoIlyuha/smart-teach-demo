import {Tables} from "./supabase.ts";

export interface UserDetails extends Tables<'users'>{
  role_name: string;
  group: Tables<'student_groups'>;
}