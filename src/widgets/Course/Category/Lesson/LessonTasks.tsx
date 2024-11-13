import {useEffect, useState} from "react";
import {useCourse} from "../../../../shared/hok/Course.ts";
import {Badge, Button, Flex, Table, Tooltip, Typography} from "antd";
import {GrTest} from "react-icons/gr";
import {typeIcon} from "../../../../shared/config/lessonTypeIcons.tsx";
import PreviewKnowledge from "../../../Knowledge/components/Preview/PreviewKnowledge.tsx";
import {Knowledge, Task} from "../../../../shared/types/CourseTypes.ts";
import {DownOutlined} from "@ant-design/icons";
import {useCourseStore} from "../../../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";
import TaskPreview from "../../QuestionBank/TaskBank/components/TaskPreview.tsx";

export default function LessonTasks() {
  const {selectedLesson, activeCategory} = useCourse();
  const [dataSource, setDataSource] = useState<Task[]>([]);
  const {course, loading} = useCourseStore(useShallow(state => ({
    loading: state.taskLoading,
    course: state.course,
  })));

  useEffect(() => {
    if (selectedLesson) {
      setDataSource(selectedLesson.tasks);
    }
  }, [activeCategory, course, selectedLesson]);

  const columns = [
    {
      title: 'Баллы',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      width: 80,
      render: (scores: number) => <Badge count={scores} color={'green'} showZero/>,
    },
    {
      title: 'Знания',
      dataIndex: 'knowledge',
      key: 'knowledge',
      // width: '85%',
      render: (knowledge: Knowledge[]) => <PreviewKnowledge knowledge={knowledge}/>,
    },
    Table.EXPAND_COLUMN,
  ]

  return (
    <Flex gap={8} justify={'space-between'} vertical style={{height: '100%', overflow: 'hide'}}>
      <Flex gap={8} vertical style={{padding: 12, color: 'white'}}>
        <Typography.Title level={3}>{selectedLesson?.title}</Typography.Title>
        <Typography.Text type={'secondary'}>{typeIcon[selectedLesson?.type || 'default'].label}</Typography.Text>
        {selectedLesson?.knowledge &&
            <Tooltip title={selectedLesson.knowledge.description}>
                <Typography.Text>{selectedLesson.knowledge.name}</Typography.Text>
            </Tooltip>
        }
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{y: '100%'}}
          rowKey={(task: Task) => task.id}
          expandable={{
            'expandedRowRender': (task: Task) => <TaskPreview task={task}/>,
            'expandIcon': ({expanded, onExpand, record}) =>
              <DownOutlined style={{rotate: expanded ? '180deg' : '0deg', transition: '0.3s all'}}
                            onClick={(e) => onExpand(record, e)}/>,
            'rowExpandable': (task: Task) => task.content !== null,
          }}
          style={{height: '100%', margin: 8, overflow: 'auto'}}
        />
      </Flex>
      <Button type={'primary'} size={'large'} icon={<GrTest/>} disabled style={{margin: 8}}>
        Протестировать урок
      </Button>
    </Flex>
  )
}