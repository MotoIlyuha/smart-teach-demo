import {useState} from "react";
import {Button, Flex, Input, message, Tooltip, Typography} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";

interface GroupTitleProps {
  group_name: string,
  editable: boolean,
  updateGroup: (name: string) => void
}

export default function GroupTitle({group_name, editable, updateGroup}: GroupTitleProps) {
  const [nameEdit, setNameEdit] = useState(false);
  const [groupName, setGroupName] = useState(group_name);
  const [isValid, setIsValid] = useState(true);

  const handleEditName = () => {
    if (isValid) {
      updateGroup(groupName);
      message.success('Название группы успешно изменено!');
    }
  }

  return (
    <Flex gap={8} align={'center'} style={{marginLeft: 8}}>
      <Button type={'primary'} size={'large'} style={{padding: 8}}>
        {nameEdit ? (
          <Input
            variant={'filled'}
            defaultValue={group_name}
            value={groupName}
            status={isValid ? '' : 'error'}
            onChange={(e) => {
              setGroupName(e.target.value);
              if (e.target.value.length < 2 || e.target.value.length > 8)
                setIsValid(false);
              else
                setIsValid(true);
            }}
          />
        ) : (
          <Typography.Title level={3} style={{color: 'white', margin: 0}}>
            {group_name}
          </Typography.Title>
        )}
      </Button>
      {editable && !nameEdit &&
          <Tooltip title={'Изменить название группы'}>
              <Button icon={<EditOutlined/>} onClick={() => setNameEdit(true)} type={'link'}/>
          </Tooltip>
      }
      {nameEdit &&
          <>
              <Tooltip title={'Сохранить название'}>
                  <Button icon={<CheckOutlined/>} onClick={() => handleEditName()} type={'link'}
                          style={{color: 'green'}} disabled={!isValid}/>
              </Tooltip>
              <Tooltip title={'Отмена'}>
                  <Button icon={<CloseOutlined/>} onClick={() => setNameEdit(false)} type={'link'}/>
              </Tooltip>
          </>
      }
    </Flex>
  )
}