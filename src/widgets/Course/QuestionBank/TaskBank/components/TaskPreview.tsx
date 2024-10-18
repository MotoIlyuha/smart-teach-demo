import {useLayoutEffect} from "react";
import {EditorContent} from "@tiptap/react";
import {TestPreview} from "../../../../TipTap/Editors.tsx";
import {Task} from "../../../../../shared/types/CourseTypes.ts";

export default function TaskPreview({task}: { task: Task | null }) {

  const editor = TestPreview();

  useLayoutEffect(() => {
    if (!editor?.isDestroyed && editor && task) {
      setTimeout(() => {
        editor.commands.setContent(task.content);
      }, 0);
    }
  }, [editor, task]);

  if (!editor || !task) {
    return null
  }

  return (
    <EditorContent editor={editor}/>
  )
}