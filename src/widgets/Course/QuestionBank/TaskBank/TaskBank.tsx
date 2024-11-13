import {Key, useEffect, useState} from "react";

import {ListProps, message} from "antd";
import {ProList, ProListMetas} from "@ant-design/pro-components";

import HeaderTitle from "./components/HeaderTitle.tsx";
import {CreateTaskButton, PublicSwitch} from "./components/ToolBar.tsx";
import {Lesson, Task} from "../../../../shared/types/CourseTypes.ts";
import {useCourseStore} from "../../../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";
import TaskContent from "./components/TaskContent.tsx";
import TaskTitle from "./components/TaskTitle.tsx";
import ActionButtons from "./components/ActionButtons.tsx";
import {useCourse} from "../../../../shared/hok/Course.ts";

import '../../../../shared/styles/TaskBank.css';

export default function TaskBank() {
  const {setSelectedLesson, selectedLesson, activeCategory} = useCourse();
  const [totalPagination, setTotalPagination] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<ListProps<Task>['dataSource']>([]);
  const {tasks, course, updateCourse, loading} = useCourseStore(useShallow(state => ({
    tasks: state.tasks,
    loading: state.taskLoading,
    course: state.course,
    updateCourse: state.updateCourse,
  })));
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: Key[]) => {
      if (!selectedLesson) return;
      setSelectedRowKeys(keys);
      if (!tasks) return;
      updateCourse({
        ...course,
        categories: course?.categories?.map(c => c.id === activeCategory?.id ? {
          ...c,
          lessons: c.lessons.map(l => l.id === selectedLesson?.id ? {
            ...l,
            tasks: tasks.filter(t => keys.includes(t.id))
          } : l)
        } : c)
      }).catch(e => message.error(e.message));
      setSelectedLesson({
        ...selectedLesson,
        tasks: tasks.filter(t => keys.includes(t.id)),
      } as Lesson);
    }
  };

  useEffect(() => {
    if (!loading && tasks) {
      setDataSource(tasks.filter(t => t.content !== null).map((task) => ({
        id: task.id,
        title: <TaskTitle key={task.id} task={task}/>,
        content: <TaskContent key={task.id} task={task}/>,
        actions: [<ActionButtons task={task}/>]
      })) as ListProps<Task> as ListProps<Task>['dataSource']);
      setTotalPagination(tasks.length);
      console.log(tasks);
    }
  }, [loading, tasks]);

  useEffect(() => {
    const updatedCourse = {
      ...course,
      taskBank: tasks || []
    };
    if (tasks && JSON.stringify(course) !== JSON.stringify(updatedCourse)) {
      updateCourse({
        ...course,
        taskBank: tasks.filter(t => t.content !== null)
      }).catch(e => message.error(e.message));
    }
  }, [course, selectedLesson?.tasks, tasks, updateCourse]);

  useEffect(() => {
    setSelectedRowKeys(selectedLesson?.tasks?.map(t => t.id) || []);
  }, [selectedLesson]);

  return (
    <ProList<Task>
      className={"TaskList"}
      headerTitle={<div onClick={() => console.log(course?.taskBank)}><HeaderTitle/></div>}
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
      rowKey={(task) => task.id}
      rowSelection={rowSelection}
      metas={{
        title: {},
        subTitle: {},
        description: {},
        type: {},
        content: {},
        actions: {'extra': true},
      } as ProListMetas<Task>}
      style={{minWidth: 480, height: '100%'}}
    />
  )
}