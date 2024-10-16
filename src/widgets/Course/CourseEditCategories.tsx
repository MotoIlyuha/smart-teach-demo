import {useState} from "react";
import {useShallow} from "zustand/react/shallow";
import {Collapse} from "antd";
import {useCourseStore} from "../../shared/stores/courseStore.ts";
import CategoryTitle from "./Category/CategoryTitle.tsx";
import {CollapsibleType} from "antd/es/collapse/CollapsePanel";
import {useCourse} from "../../shared/hok/Course.ts";
import CreateCategory from "./Category/CreateCategory.tsx";
import LessonList from "./Category/Lesson/LessonList.tsx";

export default function CourseEditCategories() {

  const {activeCategory, setActiveCategory} = useCourse();
  const {course} = useCourseStore(useShallow((state) => ({
    course: state.course,
  })));
  const categories = course?.categories;
  const [accordionItemsDisabled, setAccordionItemsDisabled] = useState<string[]>([]);

  const manageAccordionItems = (key: string) => (state: boolean) => {
    if (state) {
      setAccordionItemsDisabled(accordionItemsDisabled.filter(item => item !== key));
    } else {
      setAccordionItemsDisabled([...accordionItemsDisabled, key]);
    }
  }

  return (
    <Collapse
      accordion
      style={{overflow: 'auto', height: '100%', margin: 8, borderRadius: 8}}
      activeKey={activeCategory?.id ? [activeCategory.id] : []}
      onChange={key => {
        if (course && course.categories)
          setActiveCategory(course.categories.find(category => category.id === key[0]))
        else
          setActiveCategory(null);
      }}
      items={[
        ...categories?.map((category) => ({
          key: category.id,
          label: <CategoryTitle
            category={category}
            setCategoryItemDisabled={manageAccordionItems(category.id)}
          />,
          children: <LessonList category={category}/>,
          collapsible: ((category.title === '' || accordionItemsDisabled.includes(category.id)) ? 'icon' : 'header') as CollapsibleType,
          showArrow: false,
        })) || [],
        {
          key: 'new',
          showArrow: false,
          collapsible: 'icon' as CollapsibleType,
          label: <CreateCategory/>,
        }
      ]}
    />
  )
}