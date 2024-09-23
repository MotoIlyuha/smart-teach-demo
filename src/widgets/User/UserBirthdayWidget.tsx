import {useEffect, useState} from "react";
import {Typography, Button, Flex, DatePicker, message, Tooltip} from "antd";
import {Tables} from "../../types/supabase.ts";
import {CheckOutlined, EditOutlined} from "@ant-design/icons";
import supabase from "../../config/supabaseClient.ts";
import dayjs, {Dayjs} from "dayjs";

export default function UserBirthday({person}: { person: Tables<'users'> }) {
  const [editMode, setEditMode] = useState<boolean>(person.birth_date === null);
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (person.birth_date !== null) {
      setBirthDate(dayjs(person.birth_date));
    }
  }, [person]);

  const handleUpdateBirthday = async () => {
    const {data, error} = await supabase
      .from('users')
      .update({birth_date: birthDate?.toISOString()})
      .eq('id', person.id)
      .select();
    if (error) {
      message.error(error.message);
    } else if (data) {
      console.log(data);
      message.success('Дата рождения успешно обновлена!');
      setEditMode(false);
    }
  }

  return (
    <Flex gap={8} align={'baseline'}>
      <Typography.Text strong>Дата рождения:</Typography.Text>
      {editMode ? (
        <DatePicker
          value={birthDate}
          format="DD.MM.YYYY"
          onChange={(date) => {
            setBirthDate(date);
          }}
          placeholder="Выберите дату рождения"
        />
      ) : (
        <Typography.Text>{birthDate?.locale('ru').format('D MMMM YYYY г.')}</Typography.Text>
      )}
      <Tooltip title={editMode ? 'Сохранить' : 'Изменить'}>
        <Button
          type='link'
          icon={editMode ? <CheckOutlined/> : <EditOutlined/>}
          style={{color: editMode ? (birthDate === null ? 'gray' : 'green') : 'blue'}}
          disabled={birthDate === null}
          onClick={() => {
            if (!editMode) {
              setEditMode(true);
            } else {
              handleUpdateBirthday();
            }
          }}
        />
      </Tooltip>
    </Flex>
  )
}