import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Divider, Space} from "antd";

import {Tables} from "../../types/supabase.ts";
import {getUserByLogin} from "../../features/SupaBaseUsers.ts";
import UploadAvatar from "../../widgets/User/UploadAvatarWidget.tsx";


export default function UserPage() {
  const {user_login} = useParams();
  const [person, setPerson] = useState<Tables<'users'>>();

  useEffect(() => {
    if (user_login) {
      getUserByLogin(user_login)
        .then(person_by_login => {
          setPerson(person_by_login);
        })
        .catch(e => console.error(e))
    }
  }, [user_login])

  return (
    <Space align='center' direction='horizontal' size='large' split={<Divider type="vertical"/>}>
      {person && <UploadAvatar person={person}/>}
    </Space>
  )
}