import {useLayoutEffect, useState} from "react";
import {Flex, Typography, Badge} from "antd";
import {EditorContent} from '@tiptap/react'
import {TestEditor} from "../../../TipTap/Editors.tsx";
import ToolBox from "../../../TipTap/Menus/ToolBox.tsx";
import BubbleMenu from "../../../TipTap/Menus/BubbleMenu.tsx";
import PreviewKnowledge from "../../../Knowledge/components/Preview/PreviewKnowledge.tsx";
import {Knowledge} from "../../../../shared/types/CourseTypes.ts";
import {useCourse} from "../../../../shared/hok/Course.ts";
import 'katex/dist/katex.min.css'

const TaskEdit = () => {

  const {content} = useCourse();
  const [totalScores, setTotalScores] = useState<number>(0);
  const [totalKnowledge, setTotalKnowledge] = useState<Knowledge[]>([]);

  const editor = TestEditor();

  useLayoutEffect(() => {
    if (!editor?.isDestroyed && editor && content) {
      setTimeout(() => {
        editor.commands.setContent(content);
      }, 0);
    }
  }, [content, editor]);

  if (!editor)
    return null

  return (
    <Flex gap={8} vertical>
      <Flex gap={12} align={'baseline'} style={{width: '100%'}}>
        <Typography.Title level={4} style={{textWrap: 'nowrap'}}>Баллов за задание: </Typography.Title>
        <Badge count={totalScores} color="green" showZero/>
        <br/>
        <Typography.Title level={4} style={{textWrap: 'nowrap'}}>Необходимые знания: </Typography.Title>
        <PreviewKnowledge knowledge={totalKnowledge}/>
      </Flex>
      <ToolBox editor={editor}/>
      <BubbleMenu editor={editor}/>
      <EditorContent editor={editor}/>
      {/*<button onClick={() => {*/}
      {/*    if (editor instanceof Editor) {*/}
      {/*        setEditorContent(editor.getJSON())*/}
      {/*        console.log(editor.getHTML())*/}
      {/*    }*/}
      {/*}}>*/}
      {/*    Submit*/}
      {/*</button>*/}
      <button onClick={() => {
        console.log(editor?.getJSON())
      }}>Get JSON
      </button>
      {/*<div>{editorContent.text}</div>*/}
    </Flex>
  )
}

export default TaskEdit;
