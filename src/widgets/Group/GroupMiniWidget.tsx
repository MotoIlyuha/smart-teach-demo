import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {Avatar, Button, Flex, Popover, Tooltip, Typography} from "antd";

import {Tables} from "../../types/supabase.ts";
import {getGroupStudents, getHeadTeacherByGroup} from "../../features/SupaBaseGroups.ts";
import {UserOutlined} from "@ant-design/icons";
import UserMini from "../User/UserMiniWidget.tsx";

export default function GroupMiniWidget({group}: { group: Tables<'student_groups'> }) {
  const [allGroupStudents, setAllGroupStudents] = useState<Tables<'users'>[]>([]);
  const [groupModerator, setGroupModerator] = useState<Tables<'users'> | null>(null);

  useEffect(() => {
    if (group) {
      getHeadTeacherByGroup(group.id).then(setGroupModerator).catch(() => setGroupModerator(null));
      getGroupStudents(group.id).then(setAllGroupStudents).catch(() => setAllGroupStudents([]));
    }
  }, [group]);

  const groupAdv = () => (
    <Flex gap={8} vertical>
      <Flex gap={8} align={'baseline'}>
        <Button type={"primary"} style={{padding: 8}}>{group.name}</Button>
        <Typography.Text strong>Учащиеся: </Typography.Text>
        <Avatar.Group>
          {allGroupStudents.map(student => (
            <Tooltip title={student.first_name + ' ' + student.last_name} key={student.id}>
              <Link to={'/user/' + student.login}>
                <Avatar
                  key={student.id}
                  size={32}
                  icon={student.avatar ? null : <UserOutlined/>}
                  src={student.avatar}
                />
              </Link>
            </Tooltip>
          ))}
        </Avatar.Group>
        <Typography.Text strong>Всего: {allGroupStudents.length} </Typography.Text>
      </Flex>
      {groupModerator ? (
        <Flex gap={8} align={'baseline'}>
          <Typography.Text strong>Классный руководитель: </Typography.Text>
          <UserMini person={groupModerator}/>
        </Flex>
      ) : (
        <Typography.Text strong>У класса нет классного руководителя</Typography.Text>
      )}
    </Flex>
  )

  return (
    <Link to={'/group/' + group.id}>
      <Popover content={groupAdv} mouseEnterDelay={0.4} arrow autoAdjustOverflow>
        <Button type={'primary'} style={{padding: 8, margin: '8px 0'}}>
          <Typography.Text style={{color: 'white'}} strong>{group.name}</Typography.Text>класс
        </Button>
      </Popover>
    </Link>
  )
} 