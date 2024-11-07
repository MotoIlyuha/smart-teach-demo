import {FC} from "react";
import {Node} from "@tiptap/core";
import {NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {PreviewMemo, ReactComponentProps} from "../components/MemoQuestions.tsx";
import {Question} from "../../../../shared/types/CourseTypes.ts";
import styles from "../../../../shared/styles/Question.module.css";

export default function PreviewComponent() {
  return Node.create({
    name: "reactComponent",
    atom: true,
    draggable: false,
    selectable: false,
    addAttributes() {
      return {
        content: {
          default: "{}",
          parseHTML: (element: HTMLElement) => {
            const jsonString = element.getAttribute("data-content") || "{}";
            let content = {
              type: undefined
            };
            try {
              content = JSON.parse(jsonString);
            } catch (error) {
              console.error("Failed to parse JSON", error);
            }
            return content;
          },
          renderHTML: (attributes) => {
            return {
              "data-content": JSON.stringify(attributes.content),
            };
          },
        },
      }
    },
    parseHTML() {
      return [
        {
          tag: "react-component",
        },
      ];
    },
    renderHTML({HTMLAttributes}) {
      return [
        "react-component",
        {
          "data-content": JSON.stringify(HTMLAttributes.content),
        },
      ];
    },
    addNodeView() {
      return ReactNodeViewRenderer(ReactComponent as unknown as FC<NodeViewProps>);
    },
  });
}

const ReactComponent = ({node}: ReactComponentProps<Question>) => {
  const {content: question} = node.attrs;
  const inline = ['text', 'number', 'select'].includes(question.type as QuestionType);

  return (
    <NodeViewWrapper className="react-component" style={{display: inline ? 'inline' : 'block'}}>
      <div className={`${styles.question} ${inline ? styles.inline : ''}`}>
        <PreviewMemo question={question}/>
      </div>
    </NodeViewWrapper>
  );
}