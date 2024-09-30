import {Skeleton} from "antd";
import {useUserStore} from "../../shared/stores/userStore.ts";
import GroupMiniWidget from "./GroupMiniWidget.tsx";
import {useGroupStore} from "../../shared/stores/groupStore.ts";
import {useShallow} from "zustand/react/shallow";
import {useEffect} from "react";

export default function UserGroup() {
  const {user: person, loading: personLoading} = useUserStore();
  const {group: group_data, fetchGroup, loading: groupLoading} = useGroupStore(useShallow(state => ({
    group: state.group,
    fetchGroup: state.fetchGroup,
    loading: state.loading
  })));

  useEffect(() => {
    if (person) {
      fetchGroup(person.group_id);
    }
  }, [fetchGroup, person]);

  if (personLoading || groupLoading || !group_data) return <Skeleton.Input active/>

  return (
    <GroupMiniWidget group_data={group_data}/>
  )
}