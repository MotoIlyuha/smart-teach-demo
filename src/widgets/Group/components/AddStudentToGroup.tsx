import {useState} from "react";
import {Button, Divider, Flex, Form, Input, Modal, Space, Typography} from "antd";
import {Snippet} from '@ant-design/pro-editor';
import {UserAddOutlined} from "@ant-design/icons";
import {checkIfLoginExists} from "../../../features/SupaBaseAuth.ts";
import {getUserByLogin} from "../../../features/SupaBaseUsers.ts";

interface AddStudentToGroupProps {
  group_id: string;
  invited_id?: string;
  addStudent: (student_login: string) => void;
}

export default function AddStudentToGroup({group_id, addStudent, invited_id = ''}: AddStudentToGroupProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddStudent = () => {
    const login: string = form.getFieldValue('login');
    if (login) {
      addStudent(login);
      form.resetFields();
      setOpen(false);
    }
  }

  return (
    <>
      <Modal
        open={open}
        title={'Добавить ученика в группу'}
        cancelText={'Отмена'}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <Flex gap={8} vertical>
          <Form form={form} onFinish={handleAddStudent} requiredMark={'optional'}>
            <Space.Compact block>
              <Form.Item
                name={'login'}
                label={"По логину:"}
                rules={[
                  {required: true, message: 'Введите логин!'},
                  () => ({
                     async validator(_, value) {
                       if (value) {
                         const isValid = await checkIfLoginExists(value);
                         if (isValid) {
                           const user = await getUserByLogin(value);
                           if (user.role_id !== 1)
                             return Promise.reject(new Error('Ученика с таким логином нет'));
                           else if (user.group_id === group_id)
                             return Promise.reject(new Error('Ученик уже в группе'));
                           else return Promise.resolve();
                         }
                         else return Promise.reject(new Error('Ученика с таким логином нет'));
                       }
                       return Promise.resolve();
                     },
                    validateTrigger: 'onSubmit'
                  })
                ]}
              >
                <Input placeholder={'Логин'}/>
              </Form.Item>
              <Button
                type={'primary'}
                icon={<UserAddOutlined/>}
                htmlType="submit"
              >Добавить</Button>
            </Space.Compact>
          </Form>
          <Divider type={'horizontal'} variant={'solid'} style={{margin: 0}}>или</Divider>
          <Flex gap={8} align={'baseline'}>
            <Typography.Text style={{textWrap: 'nowrap'}}>по ссылке</Typography.Text>
              <Snippet prefix={'https://'}  hidden={true}>
                {`https://${window.location.host}/add_to_group/${group_id}?invitedBy=${invited_id}`}
              </Snippet>
          </Flex>
        </Flex>
      </Modal>
      <Button type={'primary'} icon={<UserAddOutlined/>}
              onClick={() => setOpen(true)}>
        Добавить ученика
      </Button>
    </>
  )
}