import {FC} from "react";
import {Node} from "@tiptap/core";
import {NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {ReactComponentProps, TestMemo} from "../components/MemoQuestions.tsx";
import {QuestionType, QuestionWithAnswer} from "../../../../shared/types/CourseTypes.ts";
import styles from "../../../../shared/styles/Question.module.css";

export default function TestComponent() {

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
            return {
              'data-content': JSON.stringify(attributes.content)
            };
          },
        },
      }
    },
    renderHTML({HTMLAttributes}) {
      return ['react-component', {
        'data-content': JSON.stringify(HTMLAttributes.content),
      }];
    },
    addNodeView() {
      return ReactNodeViewRenderer(ReactComponentNode as unknown as FC<NodeViewProps>)
    }
  })
}

const ReactComponentNode = ({node, updateAttributes}: ReactComponentProps<QuestionWithAnswer>) => {

  const inline = ['text', 'number', 'select'].includes(node.attrs.content.type as QuestionType);

  return (
    <NodeViewWrapper className="react-component" style={{display: inline ? 'inline' : 'block'}}>
      <div className={`${styles.question} ${inline ? styles.inline : ''}`}>
        <TestMemo question={node.attrs.content} updateAttributes={(attrs: Partial<QuestionWithAnswer>) => {
          updateAttributes({content: {...node.attrs.content, ...attrs}} as Partial<QuestionWithAnswer>);
          console.log("UPATTR: ", {...node.attrs.content, ...attrs});
        }}/>
      </div>
    </NodeViewWrapper>
  )
}