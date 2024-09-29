import {useState} from "react";
import {Button, DatePicker, Flex, message, Skeleton, Tooltip, Typography} from "antd";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import dayjs, {Dayjs} from "dayjs";
import {useUserStore} from "../../shared/stores/userStore.ts";

dayjs.locale('ru');

export default function UserBirthday({editable}: { editable: boolean }) {
  const person = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const loading = useUserStore((state) => state.loading);
  const [editMode, setEditMode] = useState<boolean>(person?.birth_date === null);
  const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs(person?.birth_date));

  const handleUpdateBirthday = async () => {
    await updateUser({birth_date: birthDate?.toISOString()})
      .then(() => {
        message.success('Дата рождения обновлена!');
        setEditMode(false);
      })
      .catch(e => message.error(e.message))
  }

  if (loading || !person) return <Skeleton.Input active/>

  return (
    <>
      {editable ? (
        <>
        {editMode ? (
          <Flex gap={8} align={'baseline'}>
            <DatePicker
              value={birthDate}
              format="DD.MM.YYYY"
              onChange={setBirthDate}
              placeholder="Выберите дату рождения"
            />
            <Tooltip title={'Сохранить'}>
              <Button type="link" onClick={handleUpdateBirthday} icon={<CheckOutlined/>} style={{color: "green"}}/>
            </Tooltip>
            <Tooltip title={'Отмена'}>
              <Button type={'link'} onClick={() => setEditMode(false)} icon={<CloseOutlined/>}/>
            </Tooltip>
          </Flex>
          ) : (
          <Flex align={'baseline'}>
        <Typography.Text>{birthDate?.locale('ru').format('DD.MM.YYYY г.')}</Typography.Text>
        <Tooltip title={'Изменить дату рождения'}>
          <Button onClick={() => setEditMode(true)} type={'link'} icon={<EditOutlined/>}
                  style={{color: 'green'}}/>
        </Tooltip>
        </Flex>
      )}
    </>
  )
:
  (
    <Typography.Text>{birthDate?.locale('ru').format('DD.MM.YYYY г.')}</Typography.Text>
  )
}
</>
)
}