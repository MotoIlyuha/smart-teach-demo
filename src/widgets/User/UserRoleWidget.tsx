import {Skeleton, Tag} from "antd";
import {useUserStore} from "../../shared/stores/userStore.ts";

export default function UserRole() {
  const person = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  let userRole;
  let color;

  switch (person?.role_name) {
    case 'admin':
      userRole = 'Администратор';
      color = 'purple';
      break;
    case 'teacher':
      userRole = 'Учитель';
      color = 'green';
      break;
    case 'student':
      userRole = 'Учащийся';
      color = 'blue';
      break;
  }

  if (loading || !person) return <Skeleton.Input active size={'small'} style={{margin: 8}}/>;

  return (
    <Tag color={color} style={{width: 'fit-content'}}>
      {userRole}
    </Tag>
  )
}