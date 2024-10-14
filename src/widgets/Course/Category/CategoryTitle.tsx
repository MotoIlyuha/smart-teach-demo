import {useState} from "react";
import {useShallow} from "zustand/react/shallow";
import {Flex, message, Typography} from "antd";
import {Input} from "@ant-design/pro-editor";
import {EditAction, DeleteAction} from "@ant-design/pro-editor";
import {Category} from "../../../shared/types/CourseTypes.ts";
import {useCourseStore} from "../../../shared/stores/courseStore.ts";
import styles from "./CategoryTitle.module.css";

interface CategoryTitleProps {
  category: Category,
  setCategoryItemDisabled: (disabled: boolean) => void
}

export default function CategoryTitle({category, setCategoryItemDisabled}: CategoryTitleProps) {
  const {course, updateCourse} = useCourseStore(useShallow((state) => ({
    course: state.course,
    updateCourse: state.updateCourse
  })));
  const [editableStr, setEditableStr] = useState(category.title);
  const [hovered, setHovered] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [valid, setValid] = useState(true);

  const handleEditCategoryTitleBlur = () => {
    if (valid) {
      updateCourse({
        ...course,
        categories: course?.categories.map(c => c.id === category.id ? {...c, title: editableStr} : c)
      }).catch(() => message.error('Не удалось обновить курс!'));
      setOnEdit(false);
    }
  }

  if (!course) return;

  return (
    <Flex align={'baseline'} justify={'space-between'} gap={8}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {onEdit ?
        <Input
          value={editableStr}
          onValueChanging={(v) => {
            setValid(v.length > 2 && v.length < 20);
            setEditableStr(v);
          }}
          onBlur={handleEditCategoryTitleBlur}
          onKeyDown={event => event.key === 'Enter' && handleEditCategoryTitleBlur()}
          placeholder={'Название раздела'}
          status={valid ? undefined : 'error'}
          allowClear
        />
        :
        <Typography.Text className={styles.itemTitle}>{editableStr}</Typography.Text>
      }
      {(hovered || onEdit) &&
          <Flex gap={8}>
              <EditAction
                  title={'Редактировать название'}
                  onClick={event => {
                    event.stopPropagation();
                    setCategoryItemDisabled(onEdit);
                    if (valid)
                      setOnEdit(!onEdit);
                    if (onEdit) {
                      setEditableStr(category.title);
                      handleEditCategoryTitleBlur();
                    }
                  }}/>
              <DeleteAction
                  title={'Удалить раздел'}
                  onClick={e => {
                    e.stopPropagation();
                    updateCourse({
                      ...course,
                      categories: course.categories.filter(c => c.id !== category.id)
                    }).catch(() => message.error('Не удалось удалить курс!'));
                  }}
              />
          </Flex>}
    </Flex>
  )
}