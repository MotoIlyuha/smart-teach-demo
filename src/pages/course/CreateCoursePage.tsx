import {Button, Checkbox, Form, Input, message, Space, Typography} from "antd";
import {useCourseStore} from "../../shared/stores/courseStore.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hok/Auth.ts";
import UserMini from "../../widgets/User/UserMiniWidget.tsx";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";

export default function CreateCoursePage() {
  const {person} = useAuth();
  const {course, createCourse, error} = useCourseStore(useShallow((state) => ({
    course: state.course,
    createCourse: state.createCourse,
    error: state.error
  })));
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  const handleFinish = async (values) => {
    console.log(values);
    createCourse(values)
      .then(() => {
        if (course && course.id) {
          navigate(`/course/${course.id}/edit`);
          message.success('Курс успешно создан!');
        }
      })
      .catch(e => message.error(e.message));
  }

  return (
    <Space size={'large'} direction={'vertical'} align={'center'}>
      <Typography.Title level={3}>Создание курса</Typography.Title>
      <Form
        form={form}
        onFinish={handleFinish}
        layout={'horizontal'}
        labelWrap={true}
        labelCol={{span: 10}}
      >
        <Form.Item
          name={'title'}
          label={'Название курса'}
          required={true}
          rules={[
            {required: true, message: 'Пожалуйста, введите название курса!'},
            {max: 40, message: 'Слишком длинное название курса'}
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name={'description'}
          label={'Описание курса'}
          rules={[
            {max: 255, message: 'Слишком длинное описание курса'}
          ]}
        >
          <Input.TextArea showCount={255} maxLength={255}/>
        </Form.Item>
        <Form.Item
          name={'public'}
          label={'Публичный'}
        >
          <Checkbox defaultChecked={true} value={true}/>
        </Form.Item>
        <Form.Item
          name={'author_id'}
          label={'Автор курса'}
          initialValue={person?.id}
        >
          <UserMini person={person}/>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 10}}>
          <Button type={'primary'} htmlType={'submit'}>Создать</Button>
        </Form.Item>
      </Form>
    </Space>
  )
}