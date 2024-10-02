import {Link} from "react-router-dom";

import {Avatar, Button, Flex, Popover, Tooltip, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import UserMini from "../User/UserMiniWidget.tsx";
import {GroupDetails} from "../../features/SupaBaseGroups.ts";
import {Tables} from "../../shared/types/supabase.ts";

export default function GroupMiniWidget({group_data}: { group_data: GroupDetails }) {
  const {students, moderator} = group_data ?? {group: null, students: [], moderator: null};

  if (!group_data || !group_data.group) return null;

  const tooltipTitle = (student: Tables<"users">) => (
    student.first_name || student.last_name ? student.first_name + ' ' + student.last_name : student.login
  )

  const groupAdv = () => (
    group_data.group &&
    <Flex gap={8} vertical>
        <Flex gap={8} align={'baseline'}>
            <Button type={"primary"} style={{padding: 8}}>{group_data.group.name}</Button>
            <Typography.Text strong>Учащиеся: </Typography.Text>
            <Avatar.Group>
              {students.map(student => (
                <Tooltip title={tooltipTitle(student)} key={student.id}>
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
            <Typography.Text strong>Всего: {students.length} </Typography.Text>
        </Flex>
      {moderator ? (
        <Flex gap={8} align={'center'}>
          <Typography.Text strong>Классный руководитель: </Typography.Text>
          <UserMini person={moderator}/>
        </Flex>
      ) : (
        <Typography.Text strong>У класса нет классного руководителя</Typography.Text>
      )}
    </Flex>
  )

  return (
    <Link to={'/group/' + group_data.group.id}>
      <Popover content={groupAdv} mouseEnterDelay={0.4} arrow autoAdjustOverflow>
        <Button type={'primary'} style={{padding: 8, margin: '8px 0'}}>
          <Typography.Text style={{color: 'white'}} strong>{group_data.group.name}</Typography.Text>класс
        </Button>
      </Popover>
    </Link>
  )
} 