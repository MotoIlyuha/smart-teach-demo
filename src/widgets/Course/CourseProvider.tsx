import {createContext, ReactNode, useState} from "react";
import {Category, Knowledge, Lesson, Task} from "../../shared/types/CourseTypes.ts";
import {useLayout} from "../../shared/hok/Layout.ts";

interface CourseProviderProps {
  activeCategory: Category | null | undefined
  setActiveCategory: (category: Category | null | undefined) => void
  selectedKnowledge?: Knowledge
  setSelectedKnowledge: (knowledge: Knowledge | undefined) => void
  selectMode: boolean
  setSelectMode: (selectMode: boolean) => void
  selectedLesson: Lesson | undefined
  setSelectedLesson: (lesson: Lesson | undefined) => void
  currentTask: Task | null | undefined
  setCurrentTask: (task: Task | null) => void
}

export const CourseContext = createContext<CourseProviderProps>({
  activeCategory: null,
  setActiveCategory: () => {},
  selectedKnowledge: undefined,
  setSelectedKnowledge: () => {},
  selectMode: false,
  setSelectMode: () => {},
  selectedLesson: undefined,
  setSelectedLesson: () => {},
  currentTask: undefined,
  setCurrentTask: () => {},
});

export const CourseProvider = ({children}: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null | undefined>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | undefined>(undefined);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>(undefined);
  const [currentTask, setCurrentTask] = useState<Task | null | undefined>(null);
  const {setTaskEditMode} = useLayout();

  return (
    <CourseContext.Provider value={{
      activeCategory,
      setActiveCategory,
      selectedKnowledge,
      setSelectedKnowledge,
      selectedLesson,
      setSelectedLesson,
      selectMode,
      setSelectMode: (selectMode: boolean) => {
        setSelectMode(selectMode);
        if (!selectMode) setSelectedKnowledge(undefined);
      },
      currentTask,
      setCurrentTask: (task: Task | null) => {
        setCurrentTask(task);
        if (task === null) setTaskEditMode(false);
        else setTaskEditMode(true);
      }
    }}>
      {children}
    </CourseContext.Provider>
  )
};

