import RegisterWidget from "../../widgets/Auth/Register/RegisterWidget.tsx";
import {useEffect, useState} from "react";
import {Alert, Space} from "antd";
import {useLocation} from "react-router-dom";
import {getGroupById} from "../../features/SupaBaseGroups.ts";

export default function RegisterPage() {
  const location = useLocation();
  const [error, setError] = useState("");
  const [inviteText, setInviteText] = useState("");

  useEffect(() => {
    setError(location.state?.error);
    if (location.state && location.state.group_id) {
      getGroupById(location.state.group_id).then((group) => {
        if (group) {
          setInviteText(`После регистрации вы автоматически будете зачислены в группу ${group.name}`)
        } else {
          setInviteText("После регистрации вы автоматически будете зачислены в группу")
        }
      })
    } else {
      setInviteText("");
    }
  }, [location.state]);

  return (
    <Space align='center' direction='vertical' size='large'>
      {inviteText && <Alert description={inviteText} type="info" showIcon/>}
      {error && <Alert message='Ошибка!' description={error} type="error" showIcon/>}
      <RegisterWidget groupId={location.state && location.state.group_id}/>
    </Space>
  )
}
