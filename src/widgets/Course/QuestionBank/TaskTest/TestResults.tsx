import {useLayoutEffect} from "react";
import {Result, Space} from "antd";
import {EditorContent} from "@tiptap/react";
import ResultEditor from "../../../TipTap/Questions/Result/ResultEditor.ts";
import {TestTask} from "../../../../shared/types/CourseTypes.ts";

export default function TestResults({task}: { task: TestTask }) {

  const editor = ResultEditor();

  const success = task.userPoints === task.totalPoints;

  useLayoutEffect(() => {
    if (!editor?.isDestroyed && editor) {
      setTimeout(() => {
        editor.commands.setContent(task.content);
      }, 0);
    }
  }, [task, editor]);

  return (
    <Space direction={'vertical'} style={{width: '100%'}}>
      <Result
        status={success ? 'success' : 'error'}
        title={success ? 'Тест пройден' : 'Тест не пройден'}
        subTitle={'Получено баллов: ' + task.userPoints + ' / ' + task.totalPoints}
      />
      <EditorContent editor={editor}/>
    </Space>
  )
}