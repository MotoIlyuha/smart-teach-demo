import {useEffect, useState, FC} from "react";
import {Node} from '@tiptap/core';
import {NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {Question, QuestionType} from "../../../../shared/types/CourseTypes.ts";
import {PreviewMemo, QuestionMemo, ReactComponentProps} from "../components/MemoQuestions.tsx";
import styles from "./Choice/Question.module.css";

export default function EditComponent() {

  return Node.create({
    name: 'reactComponent',
    group: 'inline',
    inline: true,
    atom: true,
    draggable: false,
    selectable: false,
    addAttributes() {
      return {
        content: {
          default: '{}',
          parseHTML: (element: HTMLElement) => {
            const jsonString = element.getAttribute('data-content') || '{}';
            let content = {
              type: undefined
            };
            try {
              content = JSON.parse(jsonString);
            } catch (error) {
              console.error('Failed to parse JSON', error);
            }
            return content;
          },
          renderHTML: (attributes) => {
            return {'data-content': JSON.stringify(attributes.content)};
          },
        },
        edit: {
          default: false,
          parseHTML: (element: HTMLElement) => {
            return element.getAttribute('data-edit') === 'true';
          },
          renderHTML: (attributes) => {
            return {'data-edit': attributes.edit};
          },
        }
      };
    },
    parseHTML() {
      return [
        {
          tag: 'react-component',
        },
      ];
    },
    renderHTML({HTMLAttributes}) {
      return ['react-component', {
        'data-content': JSON.stringify(HTMLAttributes.content),
        'data-edit': HTMLAttributes.edit
      }];
    },
    addNodeView() {
      return ReactNodeViewRenderer(ReactComponent as unknown as FC<NodeViewProps>);
    },
  });
}

const ReactComponent = ({node, updateAttributes}: ReactComponentProps<Question>) => {
  const {content: question, edit} = node.attrs;
  const [isEditing, setIsEditing] = useState(edit);
  const inline = ['text', 'number', 'select'].includes(question.type as QuestionType);

  useEffect(() => {
    setIsEditing(node.attrs.edit);
  }, [node.attrs.edit]);

  return (
    <NodeViewWrapper className="react-component" style={{display: inline ? 'inline' : 'block'}}>
      <div className={`${styles.question} ${inline ? styles.inline : ''}`} onDoubleClick={() => {
        setIsEditing(true);
        node.attrs.edit = isEditing;
      }}>
        {isEditing ?
          <QuestionMemo
            question={question}
            updateAttributes={(attrs: Partial<Question>) => {
              updateAttributes({content: {...question, ...attrs}} as Partial<Question>);
            }}
            setIsEditing={(isEditing) => {
              setIsEditing(isEditing);
              node.attrs.edit = isEditing;
            }}/>
          :
          <PreviewMemo question={question}/>}
      </div>
    </NodeViewWrapper>
  )
}
