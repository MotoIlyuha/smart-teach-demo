import {EditorContentProps, FloatingMenu} from "@tiptap/react";
import PasteQuestion from "./Nodes/Question.tsx";

export default function FloatingMenuEditor({editor}: { editor: EditorContentProps['editor'] }) {
  if (!editor) return null;

  return (
    <>
      {editor &&
          <FloatingMenu editor={editor}>
              <PasteQuestion editor={editor}/>
          </FloatingMenu>
      }
    </>
  )
}