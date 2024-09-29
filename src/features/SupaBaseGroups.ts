import {Tables} from "../types/supabase.ts";
import supabase from "../config/supabaseClient.ts";

export async function getGroupById(group_id: string): Promise<Tables<'student_groups'>> {
  const {data: group, error} = await supabase
    .from('student_groups')
    .select('*')
    .eq('id', group_id)
    .single();
  if (error) {
    console.error(error);
    throw new Error(`Error fetching group for group_id "${group_id}": ${error.message}`);
  }
  if (!group) {
    throw new Error(`No group found for group_id "${group_id}"`);
  }
  return group;
}

export async function getGroupByStudent(user_id: string, role: string): Promise<Tables<'student_groups'>> {
  if (role === 'student') {
    const {data: group, error} = await supabase
      .from('users')
      .select('group_id, student_groups!users_group_id_fkey(*)')
      .eq('id', user_id)
      .single();
    if (error) {
      console.error(error);
      throw new Error(`Error fetching group for user_id "${user_id}": ${error.message}`);
    }
    if (!group || !group.student_groups) {
      throw new Error(`No group found for user_id "${user_id}"`);
    }
    return group.student_groups;
  } else {
    console.log(role);
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

export async function getGroupStudents(group_id: string): Promise<Tables<'users'>[]> {
  const {data: students, error} = await supabase
    .from('users')
    .select('*')
    .eq('group_id', group_id);
  if (error) {
    console.error(error);
    throw new Error(`Error fetching students for group_id "${group_id}": ${error.message}`);
  }
  if (!students || students.length === 0) {
    throw new Error(`No students found for group_id "${group_id}"`);
  }
  return students;
}
