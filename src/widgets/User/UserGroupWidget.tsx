import {useEffect, useState} from "react";
import {Flex, Tag, Typography} from "antd";
import {Tables} from "../../types/supabase.ts";

import {
  getHeadTeacherByGroup,
  getModeratedGroupByTeacher,
  getGroupByStudent
} from "../../features/SupaBaseUsers.ts";

export default function UserGroup({person, userRole}: { person: Tables<'users'>, userRole: string }) {
  const [group, setGroup] = useState<Tables<'student_groups'> | null>(null);
  const [moderatedGroups, setModeratedGroups] = useState<Tables<'student_groups'>[]>([]);
  const [myHeadTeacher, setMyHeadTeacher] = useState<Tables<'users'>>();

  useEffect(() => {
    if (userRole === "teacher")
      getModeratedGroupByTeacher(person.id, userRole)
        .then(mod_groups => setModeratedGroups(mod_groups))
    else
      getGroupByStudent(person.id, userRole)
        .then(gr => {
          setGroup(gr);
          if (gr) getHeadTeacherByGroup(gr.id)
            .then(head_teacher => setMyHeadTeacher(head_teacher))
        })
  }, [person, userRole]);

  return (
    <>
      {userRole === "student" ? (
        <>
          {group === null ? (
            <Typography.Text strong>Не принадлежит ни одному классу</Typography.Text>
          ) : (
            <Flex gap={8} align={'baseline'}>
              <Typography.Text strong>Класс: </Typography.Text>
              <Tag color="blue">{group.name}</Tag>
              {myHeadTeacher && (
                <>
                  <Typography.Text strong>Классный руководитель: </Typography.Text>
                  <Typography.Text>{myHeadTeacher?.first_name} {myHeadTeacher?.last_name}</Typography.Text>
                </>
              )}
            </Flex>
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
                <Tag key={group.id} color="blue">{group.name}</Tag>
              ))}
            </Flex>
          )}
        </>
      )}
    </>
  )
}