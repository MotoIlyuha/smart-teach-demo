import {Button, Flex, Form, InputNumber, Segmented, Switch, Input} from "antd";
import {Cascader} from "@ant-design/pro-editor";
import {Knowledge, QuestionType} from "../../../../shared/types/CourseTypes";

interface QuestionTypeOptionsProps {
  options: { value: QuestionType, label: string }[]
  currentType: QuestionType
  onTypeChange: (type: QuestionType) => void
}

export function QuestionTypeOptions({options, currentType, onTypeChange}: QuestionTypeOptionsProps) {
  return (
    <Form.Item name='type'>
      <Segmented options={options} value={currentType} onChange={(type) => {
        onTypeChange(type as QuestionType);
      }}/>
    </Form.Item>
  )
}

interface QuestionRandomOptionsProps {
  state: boolean
  onStateChange: (state: boolean) => void
}

export function QuestionRandomOptions({state, onStateChange}: QuestionRandomOptionsProps) {
  return (
    <Form.Item name='random' label='Случайный порядок вариантов' labelCol={{span: 18}} wrapperCol={{span: 6}}>
      <Switch checked={state} onChange={onStateChange}/>
    </Form.Item>
  )
}

interface QuestionCostOptionsProps {
  cost: number,
  onCostChange: (cost: number) => void
}

export function QuestionCostOptions({cost, onCostChange}: QuestionCostOptionsProps) {
  return (
    <Form.Item name='cost' label='Баллы за решение' labelCol={{span: 12}} wrapperCol={{span: 7}}>
      <InputNumber
        value={cost} onChange={(c) => onCostChange(c || 0)} onStep={onCostChange} min={0} max={15}
        addonAfter={<span style={{color: 'white'}}>Б.</span>}
        style={{background: '#52c41a', color: 'white', borderRadius: 4}}
      />
    </Form.Item>
  )
}

interface QuestionKnowledgeOptionsProps {
  knowledge: Knowledge[]
  setKnowledge: (knowledge: Knowledge[]) => void
}

export function QuestionKnowledgeOptions({knowledge, setKnowledge}: QuestionKnowledgeOptionsProps) {
  return (
    <Form.Item
      name='knowledge'
      label='Знания'
      labelCol={{span: 6}}
      wrapperCol={{span: 16}}
    >
      <Cascader defaultValue={knowledge} value={knowledge} onChange={setKnowledge} options={knowledge}/>
    </Form.Item>
  )
}

interface ShowExplanationButtonProps {
  showExplanation: boolean
  setShowExplanation: (state: boolean) => void
}

export function ShowExplanationButton({setShowExplanation, showExplanation}: ShowExplanationButtonProps) {
  return (
    <Button type="link" onClick={() => setShowExplanation(!showExplanation)}>
      {showExplanation ? 'Скрыть' : 'Показать'} пояснение к правильному ответу
    </Button>
  )
}

export function SubmitButton({setIsEditing}: { setIsEditing: (state: boolean) => void }) {
  return (
    <Form.Item wrapperCol={{span: 24}} style={{marginBottom: 0, margin: 8}}>
      <Flex gap={8}>
        <Button type="default" onClick={() => setIsEditing(false)}>Отмена</Button>
        <Button type="primary" htmlType="submit">Сохранить</Button>
      </Flex>
    </Form.Item>
  )
}

export function QuestionExplanationOptions() {
  return (
    <Form.Item
      name='explanation'
      label='Пояснение к правильному ответу'
      layout={'vertical'}
      labelCol={{offset: 0}}
      wrapperCol={{span: 24}}>
      <Input.TextArea autoSize/>
    </Form.Item>
  )
}

