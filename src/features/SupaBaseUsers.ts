import supabase from "../config/supabaseClient.ts";
import {Tables} from "../types/supabase.ts";
import {UserDetails} from "../types/UserTypes.ts";
import {PostgrestError} from "@supabase/supabase-js";
import {getGroupById} from "./SupaBaseGroups.ts";

export async function getUserById(user_id: string): Promise<Tables<'users'>> {
  const {data: user, error} = await supabase.from('users').select("*").eq('id', user_id).single();
  if (error || !user) {
    console.error(error);
    throw new Error(`User with id "${user_id}" not found`);
  } else return user;
}

export async function getUserByEmail(email: string): Promise<Tables<'users'>> {
  const {data: user, error} = await supabase.from('users').select("*").eq('email', email).single();
  if (error || !user) {
    console.error(error);
    throw new Error(`User with email "${email}" not found`);
  } else return user;
}

export async function getUserByLogin(login: string): Promise<Tables<'users'>> {
  const {data: user, error} = await supabase.from('users').select("*").eq('login', login).single();
  if (error || !user) {
    console.error(error);
    throw new Error(`User with login "${login}" not found`);
  } else return user;
}

// /**
//  * Извлекает роль из таблицы «роли» на основе предоставленного идентификатора роли.
//  *
//  * @param {number} role_id — идентификатор роли, которую нужно получить.
//  * @return {Promise<Tables<'roles'>>} Обещание, которое разрешается в полученную роль.
//  * @throws {Error} Если роль с указанным идентификатором не найдена.
//  */
// export async function getRole(role_id: number): Promise<Tables<'roles'>> {
//   const {data: role, error} = await supabase.from('roles').select("*").eq('id', role_id).single();
//   if (error || !role) {
//     console.error(error);
//     throw new Error(`Role with id "${role_id}" not found`);
//   } else return role;
// }

// export async function getModeratedGroupByTeacher(id: string, role: string): Promise<Tables<'student_groups'>[] | []> {
//   if (role === 'teacher') {
//     const { data: groups, error } = await supabase
//       .from('group_moderators')
//       .select('student_groups(*)')
//       .eq('user_id', id);
//
//     if (error) {
//       console.error(error);
//       throw new Error(`Error fetching groups for user_id "${id}": ${error.message}`);
//     }
//
//     const student_groups = groups?.map((group) => group.student_groups);
//
//     if (!groups || groups.length === 0) {
//       return [];
//     }
//
//     // Проверяем, что все элементы имеют заполненное поле student_groups
//     const validGroups = student_groups.filter((group) => group !== null);
//
//     if (validGroups.length > 0 && validGroups.length === student_groups.length) {
//       return validGroups;
//     } else {
//       throw new Error('No valid groups found');
//     }
//   } else {
//     throw new Error('User is not a teacher');
//   }
// }

export async function updateUserName(user_id: string, first_name: string, last_name: string): Promise<Tables<'users'>> {
  const { data: user, error } = await supabase
    .from('users')
    .update({ first_name, last_name })
    .eq('id', user_id)
    .select();
  if (error) {
    console.error(error);
    throw new Error(`Error updating user: ${error.message}`);
  }
  return user[0];
}

export const fetchUserDetails = async (userLogin: string): Promise<{data: UserDetails | null, error: PostgrestError | null }> => {
  const { data, error } = await supabase
    .rpc('get_user_details_by_login', { user_login: userLogin })
    .single();

  if (data && !error) {
    if (data.role_name === 'teacher') {
      const return_data = {
        ...data,
        role_id: 2,
        updated_at: null,
        created_at: null,
        group: data.moderated_group_id ? await getGroupById(data.moderated_group_id) : null
      } as UserDetails;
      return {data: return_data, error: error};
    }
    else {
      const return_data = {
        ...data,
        role_id: 1,
        updated_at: null,
        created_at: null,
        group: data.group_id ? await getGroupById(data.group_id) : null
      } as UserDetails;
      return {data: return_data, error: error};
    }

  }
    else return {data: null, error: error}
};

export const updateUserDetails = async (userId: string, updates: Partial<UserDetails>) => {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  return {error};
};