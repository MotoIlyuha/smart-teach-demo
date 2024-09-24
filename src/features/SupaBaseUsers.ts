import supabase from "../config/supabaseClient.ts";
import {Tables} from "../types/supabase.ts";

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

/**
 * Извлекает роль из таблицы «роли» на основе предоставленного идентификатора роли.
 *
 * @param {number} role_id — идентификатор роли, которую нужно получить.
 * @return {Promise<Tables<'roles'>>} Обещание, которое разрешается в полученную роль.
 * @throws {Error} Если роль с указанным идентификатором не найдена.
 */
export async function getRole(role_id: number): Promise<Tables<'roles'>> {
  const {data: role, error} = await supabase.from('roles').select("*").eq('id', role_id).single();
  if (error || !role) {
    console.error(error);
    throw new Error(`Role with id "${role_id}" not found`);
  } else return role;
}

export async function getModeratedGroupByTeacher(id: string, role: string): Promise<Tables<'student_groups'>[] | []> {
  if (role === 'teacher') {
    const { data: groups, error } = await supabase
      .from('group_moderators')
      .select('student_groups(*)')
      .eq('user_id', id);

    if (error) {
      console.error(error);
      throw new Error(`Error fetching groups for user_id "${id}": ${error.message}`);
    }

    const student_groups = groups?.map((group) => group.student_groups);

    if (!groups || groups.length === 0) {
      return [];
    }

    // Проверяем, что все элементы имеют заполненное поле student_groups
    const validGroups = student_groups.filter((group) => group !== null);

    if (validGroups.length > 0) {
      return validGroups;
    } else {
      throw new Error('No valid groups found');
    }
  } else {
    throw new Error('User is not a teacher');
  }
}

export async function getStudentGroupByStudent(id: string, role: string): Promise<Tables<'student_groups'>> {
  if (role === 'student') {
    const {data: group, error} = await supabase
      .from('users')
      .select('student_groups(*)')
      .eq('id', id)
      .single();
    if (error) {
      console.error(error);
      throw new Error(`Error fetching group for user_id "${id}": ${error.message}`);
    }
    if (!group || !group.student_groups) {
      throw new Error(`No group found for user_id "${id}"`);
    }
    return group.student_groups;
  } else {
    throw new Error('User is not a student');
  }
}

export async function getHeadTeacherByGroup(group_id: string): Promise<Tables<'users'>> {
  const {data: head_teacher, error} = await supabase
    .from('group_moderators')
    .select('user_id, users(*)')
    .eq('group_id', group_id)
    .single();
  if (error) {
    console.error(error);
    throw new Error(`Error fetching head_teacher for group_id "${group_id}": ${error.message}`);
  }
  if (!head_teacher || !head_teacher.users) {
    throw new Error(`No head_teacher found for group_id "${group_id}"`);
  }
  return head_teacher.users;
}
