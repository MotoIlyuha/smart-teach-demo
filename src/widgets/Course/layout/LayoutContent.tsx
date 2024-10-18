import {Tabs} from "antd";
import KnowledgeFlow from "../../Knowledge/KnowledgeFlow.tsx";
import TaskBank from "../QuestionBank/TaskBank/TaskBank.tsx";
import TaskEdit from "../QuestionBank/TaskEdit/TaskEdit.tsx";
import {useCourse} from "../../../shared/hok/Course.ts";
import '../../../shared/styles/CourseEditPage.css';

export default function CourseLayoutContent() {
  const {taskEditMode, setTaskEditMode} = useCourse();

  const tab_items = [
    {
      key: 'knowledge-tree',
      label: `Дерево знаний`,
      children: <KnowledgeFlow/>,
      closable: false,
      style: {height: '100%'}
    },
    {
      key: 'task-bank',
      label: `Банк заданий`,
      children: <TaskBank/>,
      closable: false,
      style: {height: '100%'}
    }
  ];

  if (taskEditMode) {
    tab_items.push({
      key: 'task-edit',
      label: `Редактор заданий`,
      children: <TaskEdit/>,
      closable: true,
      style: {height: '100%'},
    });
  }

  return (
    <Tabs
      className={'course-tabs'}
      tabBarStyle={{margin: 0}}
      type={'editable-card'}
      defaultActiveKey="1"
      items={tab_items}
      activeKey={taskEditMode ? 'task-edit' : undefined}
      hideAdd={true}
      onEdit={(targetKey, action) => {
        if (action === 'remove') {
          if (targetKey === 'task-edit') setTaskEditMode(false);
        }
      }}
    />
  )
}