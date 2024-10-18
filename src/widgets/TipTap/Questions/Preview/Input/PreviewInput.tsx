import {Input, Select, InputNumber, Badge} from 'antd';

import {Question, InputType} from "../../../../../shared/types/CourseTypes";

function InputBody({question}: { question: Question }) {
  switch (question.type as InputType) {
    case 'text':
      return <Input value={question.options[0].text}/>;
    case 'number':
      return <InputNumber defaultValue={Number(question.correctAnswerIds[0])} onChange={() => {}} onStep={() => {}}
                           style={{width: question.correctAnswerIds[0].length * 10 + 50}}/>;
    case 'select':
      return (
        <Select value={question.options.map(answer => answer.id === question.correctAnswerIds[0] && answer.text)[0]}
                options={question.options.map((answer) => ({value: answer.text, label: answer.text}))}
                style={{minWidth: 100}}/>
      );
    case 'textarea':
      return <Input.TextArea value={question.correctAnswerIds[0]}/>;
    default:
      return <Input value={question.options[0].text}/>;
  }
}

export default function PreviewInput({question}: { question: Question }) {
  return (
    <Badge count={question.cost} color={'green'} showZero offset={[-2, 4]}>
    {/*<Badge.Ribbon text={`${question.cost} Б.`} placement={'end'} color={'green'} style={{top: -10}}>*/}
      <InputBody question={question}/>
    {/*</Badge.Ribbon>*/}
    </Badge>
  )
}