import {createContext, ReactNode, useState} from "react";
import {Category, Knowledge, Lesson} from "../../shared/types/CourseTypes.ts";

interface CourseProviderProps {
  activeCategory: Category | null | undefined
  setActiveCategory: (category: Category | null | undefined) => void
  selectedKnowledge?: Knowledge
  setSelectedKnowledge: (knowledge: Knowledge | undefined) => void
  selectMode: boolean
  setSelectMode: (selectMode: boolean) => void
  selectedLesson: Lesson | undefined
  setSelectedLesson: (lesson: Lesson | undefined) => void
  taskEditMode: boolean
  setTaskEditMode: (taskEditMode: boolean) => void
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
  taskEditMode: false,
  setTaskEditMode: () => {},
});

export const CourseProvider = ({children}: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null | undefined>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | undefined>(undefined);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>(undefined);
  const [taskEditMode, setTaskEditMode] = useState(false);

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
      taskEditMode,
      setTaskEditMode
    }}>
      {children}
    </CourseContext.Provider>
  )
};

