import {useLayoutEffect} from "react";
import {Flex} from "antd";
import {EditorContent} from '@tiptap/react'
import {TestEditor} from "../../../TipTap/Editors.tsx";
import ToolBox from "../../../TipTap/Menus/ToolBox.tsx";
import BubbleMenu from "../../../TipTap/Menus/BubbleMenu.tsx";
import {useCourse} from "../../../../shared/hok/Course.ts";
import 'katex/dist/katex.min.css'

const TaskEdit = () => {

  const {content} = useCourse();

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
    <Flex gap={8} vertical style={{padding: 32}}>
      <ToolBox editor={editor}/>
      <BubbleMenu editor={editor}/>
      <EditorContent editor={editor}/>
      <button onClick={() => {
        console.log(editor?.getJSON())
      }}>
        Get JSON
      </button>
    </Flex>
  )
}

export default TaskEdit;
