import {useMemo} from "react";
import {useShallow} from "zustand/react/shallow";
import {Button, Flex, Form, InputNumber, Segmented, Switch, Input} from "antd";
import {TreeSelect} from "@ant-design/pro-editor";
import {Knowledge, QuestionType} from "../../../../shared/types/CourseTypes";
import {useKnowledgeStore} from "../../../../shared/stores/knowledgeStore.ts";
import {DataNode} from "antd/es/tree";

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
  const {knowledgeTree} = useKnowledgeStore(useShallow((set) => ({knowledgeTree: set.knowledgeTree})));

  const processedTreeData = useMemo(() => {
    if (!knowledgeTree) return [];
    const loop = (data: Knowledge[]): DataNode[] => (
      data.map(item => ({
        key: item.id,
        value: item.id,
        title: item.name,
        children: item.children ? loop(item.children) : []
      }))
    )
    return loop(knowledgeTree);
  }, [knowledgeTree]);

  return (
    <Form.Item
      name='knowledge'
      label='Знания'
      labelCol={{span: 6}}
      wrapperCol={{span: 16}}
    >
      <TreeSelect
        showSearch
        allowClear
        multiple
        value={knowledge}
        onChange={setKnowledge}
        treeData={processedTreeData as DefaultTreeData[]}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Выберите знания"
      />
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

