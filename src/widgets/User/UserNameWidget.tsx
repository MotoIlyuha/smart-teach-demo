import {useState} from "react";
import {Button, Flex, Input, message, Skeleton, Tooltip, Typography} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import {useUserStore} from "../../shared/stores/userStore.ts";
import UserRole from "./UserRoleWidget.tsx";

export default function UserName({editable}: { editable: boolean }) {
  const person = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const [firstName, setFirstName] = useState<string>(person?.first_name || '');
  const [lastName, setLastName] = useState<string>(person?.last_name || '');
  const [editMode, setEditMode] = useState<boolean>(person?.first_name === '' || person?.last_name === '');
  const [loading, setLoading] = useState<boolean>(useUserStore((state) => state.loading));

  const firstNameTooltip = () => {
    if (firstName) {
      if (firstName.length < 3)
        return 'Имя не должно быть таким коротким';
      else
        return '';
    } else return 'Пожалуйста, введите имя';
  }

  const lastNameTooltip = () => {
    if (firstNameTooltip() == '')
      if (lastName) {
        if (lastName.length < 3)
          return 'Фамилия не должна быть такой короткой';
        else
          return '';
      } else return 'Пожалуйста, введите фамилию';
    else return '';
  }

  const handleUpdateName = async () => {
    setLoading(true);
    if (firstName && lastName && person)
      await updateUser({first_name: firstName, last_name: lastName})
        .then(() => {
          message.success('Имя и фамилия успешно обновлены!');
          setEditMode(false);
        })
        .catch(e => message.error(e.message));
    setLoading(false);
  };

  if (loading || !person) return <Skeleton.Input active style={{margin: 8}}/>

  return (
    <div style={{marginBottom: 16, paddingInline: 16}}>
      {editable ? (
        <>
          {editMode ? (
            <Tooltip title={'Пожалуйста, введите имя и фамилию'}
                     open={person.first_name === '' || person.last_name === ''}>
              <Flex align={'baseline'} gap={12}>
                <Tooltip title={firstNameTooltip()} open={firstNameTooltip() !== ''}>
                  <Input
                    className={'first-name-input'}
                    defaultValue={person.first_name || ''}
                    value={firstName}
                    status={firstNameTooltip() === '' ? '' : 'error'}
                    onChange={e => setFirstName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && document.getElementById('last-name-input')?.focus()}
                    placeholder="Имя"
                    variant={'filled'}
                    size={'large'}
                    style={{fontSize: '24px'}}
                  />
                </Tooltip>
                <Tooltip title={lastNameTooltip()} open={lastNameTooltip() !== ''}>
                  <Input
                    id={'last-name-input'}
                    className={'last-name-input'}
                    defaultValue={person.last_name || ''}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                    placeholder="Фамилия"
                    variant={'filled'}
                    size={'large'}
                    style={{fontSize: '24px'}}
                  />
                </Tooltip>
                <Tooltip title={'Сохранить'}>
                  <Button
                    type="link"
                    onClick={() => {
                      if (firstNameTooltip() === '' && lastNameTooltip() === '')
                        handleUpdateName();
                    }}
                    icon={<CheckOutlined/>}
                    style={{color: firstNameTooltip() === '' && lastNameTooltip() === '' ? "green" : 'grey'}}
                  />
                </Tooltip>
                {!(person.first_name === '' || person.last_name === '') && (
                  <Tooltip title={'Отмена'}>
                    <Button type={'link'} onClick={() => setEditMode(false)} icon={<CloseOutlined/>}/>
                  </Tooltip>
                )}
              </Flex>
            </Tooltip>
          ) : (
            <Flex gap={16} align={'baseline'} justify={'space-between'}>
              <Flex align={'baseline'}>
                <Typography.Title level={3}>{person.first_name} {person.last_name}</Typography.Title>
                <Tooltip title={'Изменить имя и фамилию'}>
                  <Button onClick={() => setEditMode(true)} type={'link'} icon={<EditOutlined/>}
                          style={{color: 'green'}}/>
                </Tooltip>
              </Flex>
              <UserRole/>
            </Flex>
          )}
        </>
      ) : (
        <Flex align={'baseline'} justify={'space-between'}>
          {person.first_name === null || person.last_name === null ? (
            <Typography.Title level={3}>{person.login}</Typography.Title>
          ) : (
            <Typography.Title level={3}>{person.first_name} {person.last_name}</Typography.Title>
          )}
        </Flex>
      )}
    </div>
  )
}