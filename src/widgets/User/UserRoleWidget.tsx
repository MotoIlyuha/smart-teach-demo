import {Tag} from "antd";
import {Tables} from "../../types/supabase.ts";
import {getRole} from "../../features/SupaBaseUsers.ts";
import {useEffect, useState} from "react";

export default function UserRole({person}: {person: Tables<'users'>}) {
  const [role, setRole] = useState<string>();

  useEffect(() => {
    getRole(person.role_id)
      .then(role => {
        switch (role.name) {
          case 'admin':
            role.name = 'Администратор';
            break;
          case 'teacher':
            role.name = 'Учитель';
            break;
          case 'student':
            role.name = 'Учащийся';
            break;
        }
        setRole(role.name)
      })
      .catch(e => console.error(e))
  }, [person])

  return (
    <Tag
      color={role === 'admin' ? 'red' : 'blue'}
    >
      {role}
    </Tag>
  )
}