import {EditorContentProps, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Mathematics} from "@tiptap-pro/extension-mathematics";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import EditComponent from "./EditComponent.tsx";
import styles from "../../../../shared/styles/Editor.module.css";

export default function EditEditor(): EditorContentProps['editor'] {
  return useEditor({
    immediatelyRender: true,
    autofocus: true,
    injectCSS: false,
    extensions: [
      StarterKit,
      Mathematics,
      EditComponent(),
      Placeholder.configure(
        {
          placeholder: 'Напишите условие задачи и вставьте вопрос...',
        }
      ),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
      }),
    ],
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
    editable: true
  });
}