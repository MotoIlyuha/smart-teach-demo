import {useEffect, useState} from "react";
import {Flex, message, Typography} from "antd";
import {Tables} from "../../types/supabase.ts";

import {getModeratedGroupByTeacher} from "../../features/SupaBaseUsers.ts";
import {getGroupByStudent} from "../../features/SupaBaseGroups.ts";
import GroupMiniWidget from "./GroupMiniWidget.tsx";

export default function UserGroup({person, userRole}: { person: Tables<'users'>, userRole: string }) {
  const [group, setGroup] = useState<Tables<'student_groups'> | null>(null);
  const [moderatedGroups, setModeratedGroups] = useState<Tables<'student_groups'>[]>([]);

  useEffect(() => {
    console.log(userRole);
    if (userRole === "teacher")
      getModeratedGroupByTeacher(person.id, userRole)
        .then(mod_groups => setModeratedGroups(mod_groups))
    else if (userRole === "student")
      getGroupByStudent(person.id, userRole)
        .then(setGroup)
        .catch(e => message.error(e.message));
  }, [person, userRole]);

  return (
    <>
      {userRole === "student" ? (
        <>
          {group === null ? (
            <Typography.Text strong>Не принадлежит ни одному классу</Typography.Text>
          ) : (
            <GroupMiniWidget group={group} />
          )}
        </>
      ) : (
        <>
          {moderatedGroups.length === 0 ? (
            <Typography.Text strong>Не является классным руководителем</Typography.Text>
          ) : (
            <Flex gap={8} align={'baseline'}>
              <Typography.Text strong>Классный руководитель для </Typography.Text>
              {moderatedGroups.map(group => (
                <GroupMiniWidget group={group} key={group.id}/>
              ))}
            </Flex>
          )}
        </>
      )}
    </>
  )
}