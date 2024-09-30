import {Flex, ListProps, message, Typography} from "antd";
import {ProList, ProListMetas} from "@ant-design/pro-components";
import {useShallow} from "zustand/react/shallow";
import {Tables} from "../../types/supabase.ts";
import UserMini from "../User/UserMiniWidget.tsx";
import UserMegaWidget from "../User/UserMegaWidget.tsx";
import {useGroupStore} from "../../shared/stores/groupStore.ts";
import GroupTitle from "./components/GroupTitle.tsx";
import DeleteStudentConfirm from "./components/DeleteStudentConfirm.tsx";
import AddStudentToGroup from "./components/AddStudentToGroup.tsx";
import {getUserByLogin} from "../../features/SupaBaseUsers.ts";
import './GroupWidget.css';


export default function GroupWidget({my_group}: { my_group: boolean }) {
  const {group: group_details, updateGroup, loading} = useGroupStore(useShallow(state => ({
    group: state.group,
    updateGroup: state.updateGroup,
    loading: state.loading
  })));
  const {group, students, moderator} = group_details ?? {group: null, students: null, moderator: []};

  if (!group_details || !group) return null;

  const handleAddStudent = async (student_login: string) => {
    await updateGroup(group.id, {students: [...students, await getUserByLogin(student_login)]})
      .then(() => message.success('Ученик успешно добавлен в группу!'))
      .catch((error) => message.error(error.message))
  }

  const handleDeleteStudent = async (student: Tables<'users'>) => {
    await updateGroup(group.id, {students: students.filter(s => s.id !== student.id)})
      .then(() => message.success('Ученик успешно удален из группы!'))
      .catch((error) => message.error(error.message))
  }

  const HeaderTitle = () => {
    return <Flex gap={8} align={'center'}>
      <GroupTitle group_name={group.name} editable={my_group}
                  updateGroup={(name: string) => updateGroup(group?.id, {group: {...group, name: name}})}/>
      {moderator ? (
        <>
          <Typography.Text strong style={{textWrap: 'pretty'}}>Классный руководитель: </Typography.Text>
          <UserMini person={moderator}/>
        </>
      ) : (
        <Typography.Text strong>У класса нет классного руководителя</Typography.Text>
      )}
    </Flex>
  }


  const data: ListProps<Tables<'users'>>['dataSource'] = students.map(student => ({
    ...student,
    content: <UserMegaWidget person={student}/>,
    actions: my_group ? [
      // <Link to={'/user/' + student.login} key={'user'}>
      //   <Button size={'small'}>
      //     Посмотреть профиль
      //   </Button>
      // </Link>,
      <DeleteStudentConfirm
        key={student.id}
        deleteStudent={() => handleDeleteStudent(student)}
      />
    ] : []
  }))

  return (
    <ProList<Tables<'users'>>
      bordered
      ghost={false}
      loading={loading}
      pagination={false}
      showActions={'hover'}
      itemLayout={'vertical'}
      itemCardProps={{bodyStyle: {padding: 12}}}
      grid={{gutter: 8, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3}}
      metas={{
        content: {},
        actions: {cardActionProps: 'actions'},
      } as ProListMetas<Tables<'users'>>}
      toolBarRender={() => {
        return my_group ? [
          <AddStudentToGroup
            group_id={group?.id}
            addStudent={handleAddStudent}
            invited_id={moderator?.id}
            key={'add_student'}/>
        ] : [];
      }}
      headerTitle={<HeaderTitle/>}
      dataSource={data}
      style={{width: '100%'}}
    />
  )
}