import {useEffect} from "react";
import {useLocation, useParams} from "react-router-dom";
import {useShallow} from "zustand/react/shallow";

import {Alert} from "antd";

import {useAuth} from "../../hok/Auth.ts";
import GroupWidget from "../../widgets/Group/GroupWidget.tsx";
import {useGroupStore} from "../../shared/stores/groupStore.ts";
import GroupInviteModal from "../../widgets/Group/components/GroupInviteModal.tsx";

export default function GroupPage() {
  const location = useLocation();
  const {group_id} = useParams();
  const {person} = useAuth();
  const {group, fetchGroup, updateGroup, error} = useGroupStore(useShallow(state => ({
    group: state.group,
    fetchGroup: state.fetchGroup,
    updateGroup: state.updateGroup,
    error: state.error
  })));

  useEffect(() => {
    if (group_id) {
      fetchGroup(group_id);
    }
  }, [fetchGroup, group_id]);

  if (error) return <Alert message="Error" description={error} type="error" showIcon/>

  const my_group = group?.moderator?.id === person?.id || person?.role_name === "admin";

  return (
    <>
      {group && <GroupWidget my_group={my_group}/>}
      {location.state && location.state.group_id && group &&
          <GroupInviteModal group_data={group} updateGroup={updateGroup} invited_id={location.state.invited_id}/>
      }
    </>
  )
}