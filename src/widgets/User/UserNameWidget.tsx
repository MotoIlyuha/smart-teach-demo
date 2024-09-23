import {useState} from "react";
import {Button, Flex, Input, message, Tooltip, Typography} from "antd";
import {CheckOutlined, EditOutlined} from "@ant-design/icons";
import {Tables} from "../../types/supabase.ts";
import supabase from "../../config/supabaseClient.ts";

export default function UserName({person}: { person: Tables<'users'> }) {
  const [fistName, setFirstName] = useState<string>(person.first_name || '');
  const [lastName, setLastName] = useState<string>(person.last_name || '');
  const [tooltipText, setTooltipText] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(fistName === '' || lastName === '');

  const handleUpdateName = async () => {
    const {data, error} = await supabase
      .from('users')
      .update({first_name: fistName, last_name: lastName})
      .eq('id', person.id)
      .select();
    if (error) {
      message.error(error.message);
    } else if (data) {
      message.success('Имя и фамилия успешно обновлены!');
      setEditMode(false);
    }
  };

  return (
    <Tooltip
      title={tooltipText}
      placement={'right'}
      open={fistName === '' || lastName === '' || !isValid}
    >
      <Flex gap={8} align={'baseline'}>
        {editMode ? (
          <Flex gap={8} align={'baseline'} style={{width: '50%'}}>
            <Input
              className={'first-name-input'}
              value={fistName}
              onChange={e => {
                if (e.target.value === '') {
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
              style={{width: 'fit-content', fontSize: '24px'}}
            />
            <Input
              id={'last-name-input'}
              className={'last-name-input'}
              value={lastName}
              onChange={e => {
                if (e.target.value === '') {
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
              style={{width: 'fit-content', fontSize: '24px'}}
            />
          </Flex>
        ) : (
          <Typography.Title level={3}>{fistName} {lastName}</Typography.Title>
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
  )
}