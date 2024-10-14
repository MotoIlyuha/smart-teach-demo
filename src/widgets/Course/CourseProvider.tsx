import {Category} from "../../shared/types/CourseTypes.ts";
import {createContext, ReactNode, useState} from "react";

interface CourseProviderProps {
  activeCategory: Category | null | undefined
  setActiveCategory: (category: Category | null | undefined) => void
}

export const CourseContext = createContext<CourseProviderProps>({
  activeCategory: null,
  setActiveCategory: () => {},
});

export const CourseProvider = ({children}: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null | undefined>(null);

  return (
    <CourseContext.Provider value={{activeCategory, setActiveCategory}}>
      {children}
    </CourseContext.Provider>
  )
};

