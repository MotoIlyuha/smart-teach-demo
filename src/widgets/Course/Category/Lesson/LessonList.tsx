import {useCallback, useEffect, useRef, useState} from "react";
import {useShallow} from "zustand/react/shallow";
import {Button, Flex, message, Typography} from "antd";
import {SortableList, SortableListRef} from "@ant-design/pro-editor";
import {useCourseStore} from "../../../../shared/stores/courseStore.ts";
import {Category, Lesson, LessonType} from "../../../../shared/types/CourseTypes.ts";
import LessonItemView from "./LessonItem.tsx";
import LessonItemEdit from "./LessonItemEdit.tsx";
import {useCourse} from "../../../../shared/hok/Course.ts";
import {v4 as uuidv4} from 'uuid';

interface LessonWithIndex extends Lesson {
  index: number
}

export default function LessonList({category}: { category: Category }) {
  const {setSelectMode} = useCourse();
  const {course, updateCourse} = useCourseStore(useShallow((state) => ({
    course: state.course,
    updateCourse: state.updateCourse
  })));
  const ref = useRef<SortableListRef>(null);
  const [lessons, setLessons] = useState(category.lessons || []);
  const [editableLesson, setEditableLesson] = useState<LessonWithIndex | null>(null);
  
  useEffect(() => {
    console.log(lessons);
  }, [lessons]);

  useEffect(() => {
    setSelectMode(editableLesson !== null);
  }, [editableLesson, setSelectMode]);

  // Обновляем `lessons`, если изменяется категория
  useEffect(() => {
    setLessons(category.lessons || []);
  }, [category]);

  // Обновляем курс, если изменяются уроки
  useEffect(() => {
    if (!course || !category) return;

    // Проверяем, действительно ли изменились уроки
    const currentCategory = course.categories.find((c) => c.id === category.id);
    if (currentCategory && JSON.stringify(currentCategory.lessons) !== JSON.stringify(lessons)) {
      updateCourse({
        ...course,
        categories: course.categories.map((c) =>
          c.id === category.id ? {...c, lessons: lessons} : c
        ),
      })
        .then(() => {
          console.log('Course updated successfully');
        })
        .catch(() => message.error('Не удалось обновить уроки!'));
    }
    // Удалите лишние зависимости, такие как `course` и `category`, чтобы избежать повторных рендеров
  }, [category, course, lessons, updateCourse]);

  const handleCreateLesson = () => {
    if (!course || !category) return;
    const newId = uuidv4();
    if (editableLesson && lessons.find((l) => l.id === editableLesson.id)?.title === '')
      ref?.current?.removeItem(editableLesson.index);
    const newLesson = {id: newId, title: '', type: 'default' as LessonType, tasks: [], knowledge: ''}
    ref?.current?.addItem(newLesson);
    setEditableLesson({...newLesson, index: lessons.length});
  }

  interface LessonItemProps {
    index: number
    listeners: Record<string, (param: never) => void>
    lesson: Lesson
  }

  const LessonItem = useCallback(({index, listeners, lesson}: LessonItemProps) => (
    (editableLesson && editableLesson.id === lesson.id) ?
      <LessonItemEdit
        lesson={lesson}
        handleUpdate={(_lesson: Lesson) => {
          ref?.current?.updateItem(_lesson, index);
          setEditableLesson(null);
        }}
        handleCancel={() => {
          if (lesson.title) setEditableLesson(null)
          else ref?.current?.removeItem(index);
        }}/>
      :
      <>
        {lesson.title ?
          <LessonItemView index={index} listeners={listeners as Record<string, (param: never) => void>}
                          lesson={lesson} handleDelete={() => ref?.current?.removeItem(index)}
                          handleEdit={() => setEditableLesson({...lesson, index: index})}/> : null
        }
      </>
  ), [editableLesson, setEditableLesson]);

  return (
    <SortableList<Lesson>
      ref={ref}
      value={lessons}
      onChange={setLessons}
      renderItem={(lesson: Lesson, {index, listeners}) =>
        <LessonItem
          index={index as number}
          listeners={listeners as Record<string, (param: never) => void>}
          lesson={lesson}
        />
      }
      renderEmpty={() =>
        <Flex gap={8} vertical align={'center'}>
          <Typography.Text type={'secondary'}>В этом разделе пока нет уроков</Typography.Text>
          <Button
            type={'primary'}
            onClick={() => handleCreateLesson()}>
            Создать первый урок
          </Button>
        </Flex>
      }
      creatorButtonProps={{
        creatorButtonText: 'Добавить урок',
        'record': () => {
          const newId = uuidv4();
          const newLesson = {id: newId, title: '', type: 'default' as LessonType, tasks: [], knowledge: ''}
          // setLessons(lessons.filter((l) => l.title !== ''));
          if (editableLesson?.title === '') ref?.current?.removeItem(editableLesson.index);
          setEditableLesson({...newLesson, index: lessons.length});
          return newLesson;
        }
      }}
      SHOW_STORE_IN_DEVTOOLS
    />
  )
}