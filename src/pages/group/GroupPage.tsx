import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Tables} from "../../types/supabase.ts";
import {getGroupById, getGroupStudents, getHeadTeacherByGroup} from "../../features/SupaBaseGroups.ts";
import {useAuth} from "../../hok/Auth.ts";
import GroupWidget from "../../widgets/Group/GroupWidget.tsx";

export default function GroupPage() {
  const {group_id} = useParams();
  const {person} = useAuth();
  const [group, setGroup] = useState<Tables<'student_groups'> | null>(null);
  const [groupModerator, setGroupModerator] = useState<Tables<'users'> | null>(null);
  const [groupStudents, setGroupStudents] = useState<Tables<'users'>[] | null>(null);

  const my_group = groupModerator?.id === person?.id;

  useEffect(() => {
    if (group_id) {
      getGroupById(group_id)
        .then(setGroup)
        .catch(() => setGroup(null));
      getHeadTeacherByGroup(group_id)
        .then(setGroupModerator)
        .catch(() => setGroupModerator(null));
      getGroupStudents(group_id)
        .then(setGroupStudents)
        .catch(() => setGroupStudents(null));
    }
  }, [group_id]);
  
  return (
    (group && groupModerator && groupStudents) &&
    <GroupWidget group_name={group?.name} group_moderator={groupModerator} group_students={groupStudents} my_group={my_group}/>
  )
}