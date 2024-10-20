import {createContext, ReactNode, useState} from "react";

interface CourseEditLayoutProviderProps {
  isLeftSidebarVisible: boolean;
  isRightSidebarVisible: boolean;
  setLeftSidebarVisible: (visible: boolean) => void;
  setRightSidebarVisible: (visible: boolean) => void;
  taskEditMode: boolean
  setTaskEditMode: (taskEditMode: boolean) => void;
  testMode: boolean
  setTestMode: (testMode: boolean) => void;
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
})

export const LayoutProvider = ({children}: { children: ReactNode }) => {
  const [isLeftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setRightSidebarVisible] = useState(true);
  const [taskEditMode, setTaskEditMode] = useState(false);
  const [testMode, setTestMode] = useState(false);

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
        setTestMode
      }}
    >
      {children}
    </CourseEditLayoutContext.Provider>
  );
}