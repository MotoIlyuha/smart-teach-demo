import {Tabs} from "antd";
import KnowledgeFlow from "../../Knowledge/KnowledgeFlow.tsx";
import QuestionBank from "../QuestionBank/QuestionBank.tsx";
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
          children: <QuestionBank/>,
          style: {height: '100%'}
        }]}/>
  )
}