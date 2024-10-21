import {CSSProperties, ReactNode, useEffect} from "react";
import {Tabs} from "antd";
import KnowledgeFlow from "../../Knowledge/KnowledgeFlow.tsx";
import TaskBank from "../QuestionBank/TaskBank/TaskBank.tsx";
import TaskEdit from "../QuestionBank/TaskEdit/TaskEdit.tsx";
import {useLayout} from "../../../shared/hok/Layout.ts";
import {HideLeftPanelButton, HideRightPanelButton} from "./components/HidePanelButtons.tsx";
import '../../../shared/styles/CourseEditPage.css';

type TabItemType = {
  key: string,
  label: string,
  icon?: ReactNode,
  children?: ReactNode,
  closable?: boolean,
  style?: CSSProperties
}

export default function CourseLayoutContent() {
  const {taskEditMode, setTaskEditMode, taskSaved, activeTab, setActiveTab} = useLayout();

  useEffect(() => {
    setActiveTab(activeTab);
  }, [activeTab, setActiveTab]);

  const tab_items: TabItemType[] = [
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
      label: `${!taskSaved ? '●' : ''} Редактор заданий`,
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
      hideAdd={true}
      activeKey={activeTab}
      onChange={key => setActiveTab(key)}
      onEdit={(targetKey, action) => {
        if (action === 'remove') {
          if (targetKey === 'task-edit') {
            setTaskEditMode(false);
            setActiveTab('task-bank');
          }
        }
      }}
      tabBarExtraContent={{
        right: <HideRightPanelButton/>,
        left: <HideLeftPanelButton/>
      }}
    />
  )
}