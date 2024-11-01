import {FC} from "react";
import {Node} from "@tiptap/core";
import {NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {ReactComponentProps, ResultMemo} from "../components/MemoQuestions.tsx";

import {QuestionWithAnswer} from "../../../../shared/types/CourseTypes.ts";

export default function ResultComponent() {

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

const ReactComponentNode = ({node}: ReactComponentProps<QuestionWithAnswer>) => {

  return <NodeViewWrapper className="react-component">
    <ResultMemo question={node.attrs.content}/>
  </NodeViewWrapper>
}