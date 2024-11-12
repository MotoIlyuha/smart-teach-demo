import {EditorContentProps, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Mathematics} from "@tiptap-pro/extension-mathematics";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import PreviewComponent from "./PreviewComponent.tsx";
import styles from "../../../../shared/styles/Editor.module.css";

export default function PreviewEditor(): EditorContentProps['editor'] {
  return useEditor({
    immediatelyRender: true,
    autofocus: true,
    injectCSS: false,
    extensions: [
      StarterKit,
      Mathematics,
      PreviewComponent(),
      Placeholder.configure(
        {
          placeholder: 'Пустой текст задания',
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
        class: styles.preview,
      },
    },
    editable: false
  });
}