import {Alert, Space} from "antd";

export default function CourseNotFoundPage() {
  return (
    <Space align='center' direction='vertical' size='large'>
      <Alert message='404 | Курс не найден!' description="Такого курса не существует" type="error" showIcon/>
    </Space>
  );
}