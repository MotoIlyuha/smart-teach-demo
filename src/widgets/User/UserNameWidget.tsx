import {useEffect, useState} from "react";
import {Button, Flex, Input, message, Skeleton, Tooltip, Typography} from "antd";
import {CheckOutlined, EditOutlined} from "@ant-design/icons";
import {Tables} from "../../types/supabase.ts";
import {updateUserName} from "../../features/SupaBaseUsers.ts";

export default function UserName({person, itsMe}: { person: Tables<'users'>, itsMe: boolean }) {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [tooltipText, setTooltipText] = useState<string>(
    (person.first_name === null || person.last_name === null) ? 'Пожалуйста, введите свои имя и фамилию' : '',
  );
  const [isValid, setIsValid] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(firstName === '' || lastName === '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setFirstName(person.first_name || '');
    setLastName(person.last_name || '');
    setIsLoading(false);
  }, [person.first_name, person.last_name]);

  const handleUpdateName = async () => {
    setIsLoading(true);
    if (firstName && lastName)
    updateUserName(person.id, firstName, lastName)
      .then(() => {
        message.success('Имя и фамилия успешно обновлены!');
        setEditMode(false);
      })
      .catch(e => message.error(e.message));
    setIsLoading(false);
  };

  if (isLoading) return <Skeleton active/>

  return (
    <>
      {itsMe ? (
        <Tooltip
          title={tooltipText}
          placement={'right'}
          open={firstName === '' || lastName === '' || !isValid}
        >
          <Flex gap={8} align={'baseline'} style={{width: '60%'}}>
            {editMode ? (
              <Flex gap={8} align={'baseline'}>
                <Input
                  className={'first-name-input'}
                  value={firstName}
                  onChange={e => {
                    if (e.target.value === '' || lastName === '') {
                      setIsValid(false);
                      setTooltipText('Пожалуйста, введите свои имя и фамилию');
                    } else if (e.target.value.length < 3) {
                      setIsValid(false);
                      setTooltipText('Имя не может быть таким коротким');
                    } else {
                      setIsValid(true);
                      setTooltipText('');
                    }
                    setFirstName(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && document.getElementById('last-name-input')?.focus()}
                  placeholder="Имя"
                  variant={'borderless'}
                  size={'large'}
                  style={{fontSize: '24px'}}
                />
                <Input
                  id={'last-name-input'}
                  className={'last-name-input'}
                  value={lastName}
                  onChange={e => {
                    if (e.target.value === '' || firstName === '') {
                      setIsValid(false);
                      setTooltipText('Пожалуйста, введите свои имя и фамилию');
                    } else if (e.target.value.length < 3) {
                      setIsValid(false);
                      setTooltipText('Фамилия не может быть такой короткой');
                    } else {
                      setIsValid(true);
                      setTooltipText('');
                    }
                    setLastName(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && isValid && handleUpdateName()}
                  placeholder="Фамилия"
                  variant={'borderless'}
                  size={'large'}
                  style={{fontSize: '24px'}}
                />
              </Flex>
            ) : (
              <Typography.Title level={3}>{firstName} {lastName}</Typography.Title>
            )}
            <Tooltip title={editMode ? 'Сохранить' : 'Редактировать'}>
              <Button
                icon={editMode ? <CheckOutlined/> : <EditOutlined/>}
                disabled={!isValid}
                type={'link'}
                style={{color: isValid ? 'green' : 'grey'}}
                onClick={() => {
                  if (editMode) {
                    handleUpdateName();
                  } else {
                    setEditMode(true);
                  }
                }}
              />
            </Tooltip>
          </Flex>
        </Tooltip>
      ) : (
        <>
        {person.first_name === null || person.last_name === null ? (
          <Typography.Text type={'secondary'}>{person.login}</Typography.Text>
        ) : (
          <Typography.Title level={3}>{person.first_name} {person.last_name}</Typography.Title>
        )}
        </>
      )}
    </>
  )
}