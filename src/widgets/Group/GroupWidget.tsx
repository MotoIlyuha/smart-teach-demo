import {Button, Flex, ListProps, Typography} from "antd";
import {ProList, ProListMetas} from "@ant-design/pro-components";
import {Tables} from "../../types/supabase.ts";
import UserMini from "../User/UserMiniWidget.tsx";
import UserMegaWidget from "../User/UserMegaWidget.tsx";

interface GroupWidgetProps {
  group_name: string;
  group_moderator: Tables<'users'>;
  group_students: Tables<'users'>[];
  my_group: boolean;
}


export default function GroupWidget({group_name, group_moderator, group_students, my_group}: GroupWidgetProps) {

  const data: ListProps<Tables<'users'>>['dataSource'] = group_students.map(student => ({
    // title: (<>{student.first_name} {student.last_name}</>),
    // description: (<>{student.email}</>),
    // avatar: student.avatar ? student.avatar : '',
    content: <UserMegaWidget person={student}/>,
    actions: [<>{group_moderator.first_name}</>]
  }))

  return (
    <ProList<Tables<'users'>>
      bordered
      ghost={false}
      // itemCardProps={{ghost: false}}
      pagination={false}
      showActions={'hover'}
      itemLayout={'vertical'}
      grid={{gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 3}}
      metas={{
        // title: {},
        // subTitle: {},
        // avatar: {},
        // description: {},
        content: {},
        actions: {'x-overflow-auto': false},
      } as ProListMetas<Tables<'users'>>}
      toolBarRender={() => {
        return my_group ? [
          <Button key="3" type="primary">
            Добавить ученика
          </Button>,
        ] : [];
      }}
      headerTitle={
        <Flex gap={8} align={'baseline'}>
          <Button type={'primary'} size={'large'} style={{padding: 8}}>
            <Typography.Title level={3} style={{color: 'white', margin: 0}} >
              {group_name}
            </Typography.Title>
          </Button>
          <Typography.Text strong>Классный руководитель: </Typography.Text>
          <UserMini person={group_moderator}/>
        </Flex>
      }
      dataSource={data}
      style={{width: '100%'}}
      />
  )
}