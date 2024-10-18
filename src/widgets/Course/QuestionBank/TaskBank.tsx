import {Key, useEffect, useState} from "react";
import {ListProps} from "antd";
import {ProList, ProListMetas} from "@ant-design/pro-components";
import HeaderTitle from "./components/HeaderTitle.tsx";
import {CreateTaskButton, PublicSwitch} from "./components/ToolBar.tsx";
import {Task} from "../../../shared/types/CourseTypes.ts";
import {useCourseStore} from "../../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";
import TaskContent from "./components/TaskContent.tsx";
import TaskTitle from "./components/TaskTitle.tsx";
import ActionButtons from "./components/ActionButtons.tsx";

export default function TaskBank() {
  const [totalPagination, setTotalPagination] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<ListProps<Task>['dataSource']>([]);
  const rowSelection = {
    selectedRowKeys, onChange: (keys: Key[]) => {
      setSelectedRowKeys(keys)
      console.log(keys);
    }
  };
  const {tasks, loading} = useCourseStore(useShallow(state => ({
    tasks: state.tasks,
    loading: state.taskLoading
  })));

  useEffect(() => {
    if (!loading && tasks) {
      setDataSource(tasks.map((task) => ({
        title: <TaskTitle key={task.id} task={task}/>,
        content: <TaskContent key={task.id} task={task}/>,
        actions: [<ActionButtons task={task}/>]
      })) as ListProps<Task> as ListProps<Task>['dataSource']);
      setTotalPagination(tasks.length);
    }
  }, [loading, tasks]);

  return (
    <ProList<Task>
      className={"TaskList"}
      headerTitle={<HeaderTitle/>}
      toolBarRender={() => [<CreateTaskButton/>, <PublicSwitch/>]}
      grid={{gutter: 16, column: 2, xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 3}}
      ghost={false}
      pagination={{
        defaultCurrent: 1,
        total: totalPagination,
        showSizeChanger: false,
      }}
      dataSource={dataSource}
      bordered
      loading={loading}
      itemCardProps={{bodyStyle: {padding: 0}}}
      rowSelection={rowSelection}
      // expandable={{expandedRowKeys, defaultExpandAllRows: false, onExpandedRowsChange: setExpandedRowKeys}}
      metas={{
        title: {},
        subTitle: {},
        description: {},
        type: {},
        content: {},
        actions: {'extra': true},
      } as ProListMetas<Task>}
      style={{minWidth: 480}}
    />
  )
}