import { createClient } from '@supabase/supabase-js'
import {Database} from "../shared/types/supabase.ts";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export default supabase;
