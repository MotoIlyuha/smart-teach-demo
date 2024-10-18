import {Tabs} from "antd";
import KnowledgeFlow from "../../Knowledge/KnowledgeFlow.tsx";
import TaskBank from "../QuestionBank/TaskBank.tsx";
import '../../../shared/styles/CourseEditPage.css';

export default function CourseLayoutContent() {
  return (
    <Tabs
      className={'course-tabs'}
      tabBarStyle={{margin: 0}}
      type={'card'}
      defaultActiveKey="1"
      items={[
        {
          key: 'knowledge-tree',
          label: `Дерево знаний`,
          children: <KnowledgeFlow/>,
          style: {height: '100%'}
        },
        {
          key: 'question-bank',
          label: `Банк заданий`,
          children: <TaskBank/>,
          style: {height: '100%'}
        }]}/>
  )
}