import {Tag} from "antd";

export default function UserRole({userRole}: {userRole: string}) {

  switch (userRole) {
    case 'admin':
      userRole = 'Администратор';
      break;
    case 'teacher':
      userRole = 'Учитель';
      break;
    case 'student':
      userRole = 'Учащийся';
      break;
  }

  return (
    <Tag
      color={userRole === 'admin' ? 'red' : 'blue'}
    >
      {userRole}
    </Tag>
  )
}