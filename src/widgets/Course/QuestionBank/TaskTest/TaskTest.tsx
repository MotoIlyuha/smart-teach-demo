import {useLayoutEffect, useState} from "react";
import {EditorContent} from "@tiptap/react";
import {Button, Flex, Space} from "antd";
import {useCourse} from "../../../../shared/hok/Course.ts";
import TestEditor from "../../../TipTap/Questions/Test/TestEditor.ts";
import TestResults from "./TestResults.tsx";
import {getQuestions} from "../getQuestions.ts";
import {QuestionWithAnswer, TestTask} from "../../../../shared/types/CourseTypes.ts";
import isAnswerCorrect from "../../../../shared/utils/isAnswerCorrect.ts";

export default function TaskTest() {
  const {currentTask} = useCourse();

  const defaultTask: TestTask = currentTask ? {
    ...currentTask,
    userPoints: 0,
    questions: currentTask?.questions.map(q => ({
      ...q,
      userAnswerIds: [],
      userAnswerCorrect: false,
      userPoints: 0
    })) || []
  } : {} as TestTask

  const editor = TestEditor();
  const [finish, setFinish] = useState(false);
  const [testTask, setTestTask] = useState(defaultTask);

  useLayoutEffect(() => {
    if (!editor?.isDestroyed && editor && currentTask) {
      setTimeout(() => {
        editor.commands.setContent(currentTask.content);
      }, 0);
    }
  }, [currentTask, editor]);

  const saveTask = () => {
    if (editor && currentTask) {
      const questions = getQuestions(editor).map(q => ({
          ...q,
          userPoints: 0,
          userAnswerCorrect: false,
        } as QuestionWithAnswer));
      let userPoints = 0;
      questions.forEach((question) => {
        question.userAnswerCorrect = isAnswerCorrect(question.userAnswerIds, question.correctAnswerIds, question.type)
        question.userPoints = question.userAnswerCorrect ? question.cost : 0
        userPoints += question.userPoints
      })
      const task = {
        ...currentTask,
        content: editor.getJSON(),
        questions: questions,
        userPoints: userPoints
      }
      console.log(task);
      setTestTask(task);
    }
    else console.log('!!!ERROR!!!');
  }

  if (editor && currentTask)
    return (
      <Flex gap={8} vertical style={{padding: '2em'}}>
        <Flex justify={'end'}>
          <Button
            type={'primary'}
            onClick={() => {
              if (!finish) {
                saveTask();
              } else {
                setTestTask(defaultTask);
              }
              setFinish(!finish);
            }}
          >
            {finish ? 'Пройти тест заново' : 'Закончить тест'}
          </Button>
        </Flex>
        {finish ? (
          <TestResults task={testTask}/>
        ) : (
          <Space direction={'vertical'} size={'large'} align={'center'} style={{width: '100%'}}>
            <EditorContent editor={editor}/>
          </Space>
        )}
      </Flex>
    )
}