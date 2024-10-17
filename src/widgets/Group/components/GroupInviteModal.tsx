import {App, Flex, Modal} from "antd";
import UserMini from "../../User/UserMiniWidget.tsx";
import GroupMiniWidget from "../GroupMiniWidget.tsx";
import {useEffect, useState} from "react";
import {Tables} from "../../../shared/types/supabase.ts";
import {getUserById} from "../../../features/SupaBaseUsers.ts";
import {useAuth} from "../../../shared/hok/Auth.ts";
import {GroupDetails} from "../../../features/SupaBaseGroups.ts";

interface GroupInviteModalProps {
  group_data: GroupDetails;
  updateGroup: (group_id: string, updates: Partial<GroupDetails>) => Promise<void>;
  invited_id: string;
}


export default function GroupInviteModal({group_data, updateGroup, invited_id}: GroupInviteModalProps) {
  const [invitedByUser, setInvitedByUser] = useState<Tables<'users'> | null>(null);
  const [open, setOpen] = useState(true);
  const {message} = App.useApp();
  const {person} = useAuth();

  useEffect(() => {
    console.log(person?.group_id === group_data.group?.id)
    if (person?.role_name !== "student") {
      message.error('В этой группе могут быть только ученики!')
      setOpen(false);
    } else if (person && person.group_id === group_data.group?.id) {
      message.info('Вы уже состоите в этой группе!')
      setOpen(false);
    } else if (invited_id)
        getUserById(invited_id).then(setInvitedByUser);

  }, [group_data, invited_id, message, person])

  const handleAcceptInvite = () => {
    if (person && person.login && group_data && group_data.group)
      updateGroup(group_data.group.id, {students: [...group_data.students, person]})
        .then(() => {
          setOpen(false);
          message.success(`Добро пожаловать в ${group_data.group?.name}!`);
        });
  }

  if (group_data && group_data.group)
    return (
      <Modal
        title={'Приглашение в класс'}
        open={open}
        onOk={() => handleAcceptInvite()}
        onCancel={() => setOpen(false)}
        cancelText={'Отказаться'}
        okText={'Принять'}>
        {invitedByUser ? (
          <Flex gap={8} align={'center'}>
            <UserMini person={invitedByUser}/> пригласил вас в группу <GroupMiniWidget group_data={group_data}/>
          </Flex>
        ) : (
          <Flex gap={8} align={'center'}>
            Вас пригласили в группу <GroupMiniWidget group_data={group_data}/>
          </Flex>
        )}
      </Modal>
    )
}