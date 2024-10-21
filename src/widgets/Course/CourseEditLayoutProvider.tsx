import {createContext, ReactNode, useEffect, useState} from "react";

interface CourseEditLayoutProviderProps {
  isLeftSidebarVisible: boolean;
  isRightSidebarVisible: boolean;
  setLeftSidebarVisible: (visible: boolean) => void;
  setRightSidebarVisible: (visible: boolean) => void;
  taskEditMode: boolean
  setTaskEditMode: (taskEditMode: boolean) => void;
  testMode: boolean
  setTestMode: (testMode: boolean) => void;
  taskSaved: boolean;
  setTaskSaved: (taskSaved: boolean) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
}

export const CourseEditLayoutContext = createContext<CourseEditLayoutProviderProps>({
  isLeftSidebarVisible: true,
  isRightSidebarVisible: true,
  setLeftSidebarVisible: () => {},
  setRightSidebarVisible: () => {},
  taskEditMode: false,
  setTaskEditMode: () => {},
  testMode: false,
  setTestMode: () => {},
  taskSaved: false,
  setTaskSaved: () => {},
  activeTab: '',
  setActiveTab: () => {},
})

export const LayoutProvider = ({children}: { children: ReactNode }) => {
  const [isLeftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setRightSidebarVisible] = useState(true);
  const [taskEditMode, setTaskEditMode] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [taskSaved, setTaskSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('knowledge-tree');

  useEffect(() => {
    console.log(taskEditMode);
  }, [taskEditMode]);

  return (
    <CourseEditLayoutContext.Provider
      value={{
        isLeftSidebarVisible,
        isRightSidebarVisible,
        setLeftSidebarVisible,
        setRightSidebarVisible,
        taskEditMode,
        setTaskEditMode,
        testMode,
        setTestMode,
        taskSaved,
        setTaskSaved,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </CourseEditLayoutContext.Provider>
  );
}