import {EditorContentProps, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder';
import {Mathematics} from "@tiptap-pro/extension-mathematics";
import Link from '@tiptap/extension-link';
import QuestionComponentView from "./Questions/QuestionComponentView.tsx";
import styles from "./Editor.module.css";


interface EditorsProps {
  placeholder: string
  editable: boolean
  editor_type: 'editor' | 'preview' | 'test';
  class_name?: string
}

function Editor({placeholder, editable, editor_type, class_name}: EditorsProps): EditorContentProps['editor'] {
    return useEditor({
        immediatelyRender: true,
        autofocus: true,
        injectCSS: false,
        extensions: [
            StarterKit,
            Mathematics,
            QuestionComponentView(editor_type),
            Placeholder.configure(
                {
                    placeholder: placeholder,
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
                class: class_name ?? '',
            },
        },
        editable: editable
    })
}

export function TestPreview(): EditorContentProps['editor'] {
    return Editor({
        placeholder: 'Пустой текст задания',
        editable: false,
        editor_type: 'preview',
        class_name: styles.preview
    })
}

export function TestEditor(): EditorContentProps['editor'] {
    return Editor({
        placeholder: 'Напишите условие задачи и вставьте вопрос...',
        editable: true,
        editor_type: 'editor',
        class_name: styles.editor
    })
}
