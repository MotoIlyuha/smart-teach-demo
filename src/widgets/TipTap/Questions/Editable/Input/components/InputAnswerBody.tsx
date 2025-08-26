import {useState} from "react";
import {Col, Flex, Input, InputNumber, Row, Select, Space, Typography} from "antd";
import {Checkbox, SortableList} from "@ant-design/pro-editor";
import {AnswerOption, InputType} from "../../../../../../shared/types/CourseTypes.ts";
import {ItemRender} from "../../../components/_ItemRender.tsx";
import {RandomSequenceIcon} from "../../../components/RandomSequenceIcon.tsx";
import {v4 as uuidv4} from 'uuid';

interface InputAnswersBodyProps {
  type: InputType
  initialAnswers: AnswerOption[]
  answers: AnswerOption[]
  setAnswers: (answers: AnswerOption[]) => void
  rightAnswer: string[]
  setRightAnswer: (answers: string[]) => void
  matchCase: boolean
  setMatchCase: (matchCase: boolean) => void
  randomSequence: boolean
}

export default function InputAnswersBody(
  {
    type,
    answers,
    setAnswers,
    initialAnswers,
    rightAnswer,
    setRightAnswer,
    matchCase,
    setMatchCase,
    randomSequence
  }: InputAnswersBodyProps) {
  const [numberType, setNumberType] = useState("1");

  function isNumber(str: string): boolean {
    return !isNaN(parseFloat(str)) && isFinite(Number(str));
  }

  const [minValue, setMinValue] = useState(isNumber(rightAnswer[0]) ? Number(rightAnswer[0]) : 0);
  const [maxValue, setMaxValue] = useState(isNumber(rightAnswer[1]) ? Number(rightAnswer[1]) : 0);

  const onMinChange = (value: number) => {
    setMinValue(value);
    if (value > maxValue) {
      setMaxValue(value);
      setRightAnswer([value.toString(), maxValue.toString()])
    }
  };

  const onMaxChange = (value: number) => {
    setMaxValue(value);
    if (value < minValue) {
      setMinValue(value);
      setRightAnswer([minValue.toString(), value.toString()])
    }
  };

  switch (type) {
    case "text":
      return (
        <Flex vertical>
          <Typography.Text strong style={{margin: 8}}>Введите правильные варианты ответа:</Typography.Text>
          <SortableList<AnswerOption>
            initialValues={initialAnswers}
            value={answers}
            onChange={(items: AnswerOption[]) => {
              setAnswers(items);
              setRightAnswer(items.map(item => item.text));
            }}
            renderContent={(item, index) => <ItemRender type={type} item={item as AnswerOption} index={index}/>}
            creatorButtonProps={{
              creatorButtonText: 'Новый вариант ответа',
              record: () => ({
                text: 'Вариант ' + (rightAnswer.length + 1),
                id: uuidv4()
              })
            }}
            renderEmpty={() => <Typography.Text type={'secondary'}>Добавьте хотя бы один вариант</Typography.Text>}
          />
          <Checkbox value={matchCase} onChange={(e) => setMatchCase(e.target.checked)}>Учитывать регистр</Checkbox>
        </Flex>
      )
    case "number":
      return (
        <Flex gap={8} vertical>
          <Typography.Text strong style={{margin: 8}}>Введите правильный ответ:</Typography.Text>
          <Space.Compact size={'middle'} block>
            <Select defaultValue="1" value={numberType} onChange={setNumberType}>
              <Select.Option value="1">Точное значение</Select.Option>
              <Select.Option value="2">Диапазон</Select.Option>
            </Select>
            {numberType === '1' ? (
              <InputNumber
                value={minValue}
                onChange={v => onMinChange(v ?? 0)}
              />
            ) : (
              <>
                <InputNumber
                  placeholder={'Минимум'}
                  value={minValue}
                  onChange={v => onMinChange(v ?? 0)}
                />
                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                  }}
                  placeholder="~"
                  disabled
                />
                <InputNumber
                  placeholder={'Максимум'}
                  value={maxValue}
                  onChange={v => onMaxChange(v ?? 0)}
                />
              </>
            )}
          </Space.Compact>
        </Flex>
      )
    case "select":
      return (
        <>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Typography.Text strong style={{marginLeft: 12}}>Введите список правильных вариантов:</Typography.Text>
            </Col>
          </Row>
          <Row style={{paddingTop: 8}}>
            <Col span={1.2} offset={1}>
              <RandomSequenceIcon randomSequence={randomSequence} onClick={() => {}}/>
            </Col>
            <Col span={21}>
              <Checkbox.Group value={rightAnswer} onChange={setRightAnswer}>
                <SortableList<AnswerOption>
                  initialValues={initialAnswers}
                  value={answers}
                  onChange={(items: AnswerOption[]) => {
                    setAnswers(items);
                  }}
                  renderContent={(item, index) => <ItemRender type={'multi'} item={item as AnswerOption} index={index}/>}
                  creatorButtonProps={{
                    creatorButtonText: 'Новый вариант ответа',
                    record: () => ({
                      title: 'Вариант ' + (rightAnswer.length + 1),
                      dataIndex: Date.now().toString()
                    })
                  }}
                  renderEmpty={() => <Typography.Text type={'secondary'}>Добавьте хотя бы один
                    вариант</Typography.Text>}
                />
              </Checkbox.Group>
            </Col>
          </Row>
        </>
      )
    case "textarea":
      return (
        <Flex vertical>
          <Typography.Text strong style={{margin: 8}}>Введите правильный ответ:</Typography.Text>
          <Input.TextArea value={rightAnswer[0]} onChange={(e) => setRightAnswer([e.target.value])}/>
        </Flex>
      )
  }
}