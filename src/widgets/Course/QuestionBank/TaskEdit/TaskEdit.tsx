import {useEffect, useLayoutEffect} from "react";
import {Button, Flex} from "antd";
import {GrTest} from "react-icons/gr";
import {EditorContent} from '@tiptap/react'
import {useShallow} from "zustand/react/shallow";
import {useCourseStore} from "../../../../shared/stores/courseStore.ts";
import {EditorProvider} from "../../../TipTap/EditorProvider.tsx";
import {useLayout} from "../../../../shared/hok/Layout.ts";
import {useCourse} from "../../../../shared/hok/Course.ts";
import ToolBox from "../../../TipTap/Menus/ToolBox.tsx";
import BubbleMenu from "../../../TipTap/Menus/BubbleMenu.tsx";
// import FloatingMenuEditor from "../../../TipTap/Menus/FloatingMenu.tsx";
import {Knowledge} from "../../../../shared/types/CourseTypes.ts";
import EditEditor from "../../../TipTap/Questions/Editable/EditEditor.ts";
import {getQuestions} from "../getQuestions.ts";
import 'katex/dist/katex.min.css'

const TaskEdit = () => {

  const {currentTask, setCurrentTask} = useCourse();
  const {setTaskSaved, setTaskEditMode, setActiveTab, setTaskTestMode} = useLayout();
  const {update} = useCourseStore(useShallow(state => ({
    update: state.updateTask
  })));

  const editor = EditEditor();

  useLayoutEffect(() => {
    if (!editor?.isDestroyed && editor && currentTask?.content) {
      setTimeout(() => {
        editor.commands.setContent(currentTask?.content);
      }, 0);
    }
  }, [currentTask?.content, editor]);

  useEffect(() => {
    if (editor && currentTask?.content) {
      setTaskSaved(false);
    }
  }, [currentTask?.content, editor, setTaskSaved]);

  const saveTask = () => {
    if (editor && currentTask) {
      const questions = getQuestions(editor);
      const knowledge: Knowledge[] = [];
      questions.forEach((question) => {
        question.requiredKnowledge.forEach((k) => {
          if (!knowledge.includes(k)) {
            knowledge.push(k);
          }
        })
      })
      const cost = questions.reduce((sum, question) => sum + question.cost, 0);
      const task = {
        id: currentTask.id,
        content: editor.getJSON(),
        totalPoints: cost,
        knowledge: knowledge,
        questions: questions,
        isPublic: currentTask.isPublic
      }
      update(currentTask.id, task)
        .then(() => {
          setCurrentTask(task);
          setTaskSaved(true);
        });
    }
  }

  if (!editor)
    return null

  return (
    <EditorProvider editor={editor}>
      <Flex gap={8} vertical style={{padding: 32}}>
        <Flex gap={8} justify={'end'}>
          <Button
            icon={<GrTest />}
            type={'default'}
            onClick={() => {
              saveTask();
              setTaskTestMode(true);
              setActiveTab('task-test');
            }}
          >
            Протестировать
          </Button>
          <Button
            type={'primary'}
            onClick={() => {
              saveTask();
              setTaskEditMode(false);
              setActiveTab('task-bank');
            }}>
            Сохранить
          </Button>
        </Flex>
        <ToolBox editor={editor}/>
        <BubbleMenu editor={editor}/>
        {/*<FloatingMenuEditor editor={editor}/>*/}
        <EditorContent editor={editor}/>
        <button onClick={() => {
          console.log(editor?.getJSON())
        }}>
          Get JSON
        </button>
      </Flex>
    </EditorProvider>
  )
}

export default TaskEdit;
