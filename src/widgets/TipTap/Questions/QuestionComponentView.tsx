import {FC, memo, useEffect, useState} from 'react';

import {Node, NodeConfig} from '@tiptap/core';
import {NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer} from '@tiptap/react';

import ChoiceQuestion from './Editable/Choice/ChoiceQuestion.tsx';
import PreviewChoice from "./Preview/Choice/PreviewChoice.tsx";
import InputQuestion from './Editable/Input/InputQuestion.tsx';
import PreviewInput from "./Preview/Input/PreviewInput.tsx";
import {
  ChoiceType,
  ChoiceTypes,
  InputType,
  InputTypes,
  Question,
  QuestionType
} from '../../../shared/types/CourseTypes';

import styles from './Editable/Choice/Question.module.css';

interface ReactComponentViewProps {
  node: Node & {
    attrs: {
      content: Question;
      edit: boolean;
      editor_type: 'editor' | 'preview' | 'test';
    };
  };
  updateAttributes: (attrs: Partial<Question>) => void;
}

export default function ReactComponentNode(editor_type: 'editor' | 'preview' | 'test') {

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
        editor_type: {
          default: editor_type,
          parseHTML: (element: HTMLElement) => {
            return element.getAttribute('data-editor_type') || 'editor';
          },
          renderHTML: (attributes) => {
            return {'data-editor_type': attributes.editor_type};
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
          tag: 'react-component'
        },
      ];
    },

    renderHTML({HTMLAttributes}) {
      return ['react-component', {'data-content': JSON.stringify(HTMLAttributes.content)}];
    },

    addNodeView() {
      return ReactNodeViewRenderer(ReactComponent as unknown as FC<NodeViewProps>);
    },

  } as Partial<NodeConfig>);
}


const ReactComponent = ({node, updateAttributes}: ReactComponentViewProps) => {
  const {content: question, editor_type, edit} = node.attrs;
  const [isEditing, setIsEditing] = useState(edit);

  useEffect(() => {
    setIsEditing(node.attrs.edit);
  }, [node.attrs.edit]);

  if (!question) {
    return null;
  }

  function Component() {
    console.log(isEditing, question);
    if (editor_type === 'editor' && isEditing)
      return <QuestionMemo
        question={question}
        updateAttributes={(attrs: Partial<Question>) => {
          updateAttributes({content: {...question, ...attrs}});
        }}
        setIsEditing={(isEditing) => {
          setIsEditing(isEditing);
          node.attrs.edit = isEditing;
        }}
      />;
    else return <PreviewMemo question={question}/>;
  }

  const inline = ['text', 'number', 'select'].includes(question.type as QuestionType);

  return (
    <NodeViewWrapper className="react-component" style={{display: inline ? 'inline' : 'block'}}>
      <div className={`${styles.question} ${inline ? styles.inline : ''}`} onDoubleClick={() => {
        if (editor_type === 'editor') {
          setIsEditing(true);
          node.attrs.edit = isEditing;
        }
      }}>
        <Component/>
      </div>
    </NodeViewWrapper>
  );
};

interface QuestionMemoProps {
  question: Question;
  updateAttributes: (attrs: Partial<Question>) => void;
  setIsEditing: (isEditing: boolean) => void;
}

const QuestionMemo = memo(({question, updateAttributes, setIsEditing}: QuestionMemoProps) => {
  if (ChoiceTypes.includes(question.type as ChoiceType))
    return <ChoiceQuestion
      question={question}
      updateAttributes={updateAttributes}
      setIsEditing={setIsEditing}
    />;
  else if (InputTypes.includes(question.type as InputType))
    return <InputQuestion
      question={question}
      updateAttributes={updateAttributes}
      setIsEditing={setIsEditing}
    />;
});

const PreviewMemo = memo(({question}: { question: Question }) => {
  if (ChoiceTypes.includes(question.type as ChoiceType))
    return <PreviewChoice question={question}/>;
  else if (InputTypes.includes(question.type as InputType))
    return <PreviewInput question={question}/>;
});