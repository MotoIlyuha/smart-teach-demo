import {Tables} from "../types/supabase.ts";
import supabase from "../config/supabaseClient.ts";
import {PostgrestError} from "@supabase/supabase-js";
import {getUserById} from "./SupaBaseUsers.ts";

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

export interface GroupDetails {
  group: Tables<'student_groups'> | null
  moderator: Tables<'users'> | null
  students: Tables<'users'>[]
}

export async function fetchGroupDetails(group_id: string):
  Promise<{ data: GroupDetails | null, error: PostgrestError | null }> {
  const {data: groupDetails, error} = await supabase.rpc('get_group_details_by_id', {input_group_id: group_id});

  if (groupDetails && !error) {
    const group = await getGroupById(group_id);
    const moderator = await getUserById(groupDetails[0].moderator_id);
    const students = await Promise.all(groupDetails.map(async gr => await getUserById(gr.user_id)));

    const return_data = {
      group: group,
      moderator: moderator,
      students: students
    } as GroupDetails;

    return {data: return_data, error: error};
  } else return {data: null, error: error}
}

export async function updateGroupDetails(group_id: string, updates: Partial<GroupDetails>):
  Promise<{ error: PostgrestError | null }> {
  const {error} = await supabase
    .from('student_groups')
    .update({name: updates.group?.name})
    .eq('id', group_id);

  if (updates.moderator) {
    await supabase
      .from('group_moderators')
      .update({user_id: updates.moderator.id})
      .eq('group_id', group_id);
  }

  if (updates.students) {
    await supabase.from('users').update({group_id: null}).eq('group_id', group_id);

    for (const student of updates.students) {
      await supabase
        .from('users')
        .update({group_id: group_id})
        .eq('id', student.id);
    }
  }

  return {error};
}

export async function deleteGroup(group_id: string): Promise<{ error: PostgrestError | null }> {
  const {error} = await supabase
    .from('student_groups')
    .delete()
    .eq('id', group_id);
  return {error};
}

export async function AddStudentToGroupByLogin(group_id: string, user_login: string): Promise<{ error: PostgrestError | null }> {
  const {error} = await supabase
    .from('users')
    .update({group_id: group_id})
    .eq('login', user_login);
  return {error};
}
