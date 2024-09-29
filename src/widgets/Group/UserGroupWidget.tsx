import {Skeleton, Tag} from "antd";
import {useUserStore} from "../../shared/stores/userStore.ts";

export default function UserGroup() {
  const {user: person, loading} = useUserStore();

  // useEffect(() => {
  //   if (userRole === "teacher")
  //     getModeratedGroupByTeacher(person.id, userRole)
  //       .then(mod_groups => setModeratedGroups(mod_groups))
  //   else if (userRole === "student")
  //     getGroupByStudent(person.id, userRole)
  //       .then(setGroup)
  //       .catch(e => message.error(e.message));
  // }, [person.id, userRole]);

  if (loading) return <Skeleton active/>

  return (
    <Tag>{person?.group_name}</Tag>
  )
}