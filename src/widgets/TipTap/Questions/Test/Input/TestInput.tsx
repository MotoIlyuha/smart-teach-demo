import {useState} from "react";
import {QuestionWithAnswer} from "../../../../../shared/types/CourseTypes.ts";
import {Badge, Input, InputNumber, Select} from "antd";

interface TestProps {
  question: QuestionWithAnswer
  updateAttributes: (attrs: Partial<QuestionWithAnswer>) => void
  onFocus: () => void
  onBlur: () => void
}

function TextTest({updateAttributes, ...props}: TestProps) {
  const [text, setText] = useState('');

  return (
    <Input
      allowClear
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        updateAttributes({userAnswerIds: [e.target.value]} as Partial<QuestionWithAnswer>);
      }}
      style={{minWidth: 120}}
      onFocus={() => props.onFocus()}
      onBlur={() => props.onBlur()}
    />
  )
}

function NumberTest({updateAttributes, ...props}: TestProps) {
  const [number, setNumber] = useState<number>();

  return (
    <InputNumber
      value={number}
      onChange={(value: number | null) => {
        setNumber(value || 0);
        updateAttributes({userAnswerIds: [(value || '0').toString()]} as Partial<QuestionWithAnswer>);
      }}
      style={{minWidth: 120}}
      onFocus={() => props.onFocus()}
      onBlur={() => props.onBlur()}
    />
  )
}

function SelectTest({question, updateAttribute, ...props}: TestProps) {
  const [select, setSelect] = useState<string[]>([]);

  return (
    <Select
      value={select}
      onChange={(value: string[]) => {
        setSelect(value);
        updateAttributes({userAnswerIds: value} as Partial<QuestionWithAnswer>);
      }}
      options={question.options.map((answer) => ({value: answer.id, label: answer.text}))}
      mode={question.options.length > 1 ? 'multiple' : undefined}
      style={{minWidth: 120}}
      onFocus={() => props.onFocus()}
      onBlur={() => props.onBlur()}
    />
  )
}

function TextareaTest({updateAttributes, ...props}: TestProps) {
  const [textarea, setTextarea] = useState('');

  return (
    <Input.TextArea
      value={textarea}
      onChange={(e) => {
        setTextarea(e.target.value);
        updateAttributes({userAnswerIds: [e.target.value]} as Partial<QuestionWithAnswer>);
      }}
      style={{minWidth: 120}}
      onFocus={() => props.onFocus()}
      onBlur={() => props.onBlur()}
    />
  )
}

function DynamicInput(props: TestProps) {
  switch (props.question.type) {
    case 'text':
      return <TextTest {...props}/>;
    case 'number':
      return <NumberTest {...props}/>;
    case 'select':
      return <SelectTest {...props}/>;
    case 'textarea':
      return <TextareaTest {...props}/>;
    default:
      return <TextTest {...props}/>
  }
}

export default function TestInput({question, updateAttributes}: TestProps) {
  const [onFocus, setOnFocus] = useState(false);

  return (
    <Badge
      count={question.cost} color={'green'} showZero offset={[-2, 4]}
      style={{opacity: onFocus ? 0 : 1}}
    >
      <DynamicInput
        question={question}
        updateAttributes={updateAttributes}
        onFocus={() => setOnFocus(true)}
        onBlur={() => setOnFocus(false)}
      />
    </Badge>
  )
}