import {Button, Popconfirm} from "antd";
import {UserDeleteOutlined} from "@ant-design/icons";

export default function DeleteStudentConfirm({deleteStudent}: {deleteStudent: () => void}) {

  const handleDeleteStudent = () => {
    deleteStudent();
  }

  return (
    <Popconfirm
      title={'Вы уверены, что хотите исключить ученика из класса?'}
      onConfirm={() => handleDeleteStudent()}
      okText={'Удалить'}
      cancelText={'Отмена'}
    >
      <Button icon={<UserDeleteOutlined/>} size={'small'} danger>
        Исключить из класса
      </Button>
    </Popconfirm>
  )
}