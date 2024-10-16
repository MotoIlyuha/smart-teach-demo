import {createContext, ReactNode, useState} from "react";
import {Category, Knowledge} from "../../shared/types/CourseTypes.ts";

interface CourseProviderProps {
  activeCategory: Category | null | undefined
  setActiveCategory: (category: Category | null | undefined) => void
  selectedKnowledge?: Knowledge
  setSelectedKnowledge: (knowledge: Knowledge | undefined) => void
  selectMode: boolean
  setSelectMode: (selectMode: boolean) => void
}

export const CourseContext = createContext<CourseProviderProps>({
  activeCategory: null,
  setActiveCategory: () => {},
  selectedKnowledge: undefined,
  setSelectedKnowledge: () => {},
  selectMode: false,
  setSelectMode: () => {},
});

export const CourseProvider = ({children}: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null | undefined>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | undefined>(undefined);
  const [selectMode, setSelectMode] = useState(false);

  return (
    <CourseContext.Provider value={{
      activeCategory,
      setActiveCategory,
      selectedKnowledge,
      setSelectedKnowledge,
      selectMode,
      setSelectMode: (selectMode: boolean) => {
        setSelectMode(selectMode);
        if (!selectMode) setSelectedKnowledge(undefined);
      },
    }}>
      {children}
    </CourseContext.Provider>
  )
};

