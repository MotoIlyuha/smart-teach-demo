import {AnswerOption, InputType, Knowledge, Question} from "../../../../../../shared/types/CourseTypes.ts";
import {Divider, Flex, Form, Space} from "antd";
import {
  QuestionCostOptions, QuestionExplanationOptions,
  QuestionKnowledgeOptions,
  QuestionRandomOptions,
  QuestionTypeOptions, ShowExplanationButton, SubmitButton
} from "../../../components/QuestionOptions.tsx";
import InputAnswersBody from "./InputAnswerBody.tsx";

interface PopoverBodyProps {
  question: Question
  updateAttributes: (attrs: Partial<Question>) => void
  setIsEditing: (isEditing: boolean) => void
  answers: AnswerOption[]
  setAnswers: (answers: AnswerOption[]) => void
  rightAnswer: string[]
  setRightAnswer: (answers: string[]) => void
  cost: number
  setCost: (cost: number) => void
  currentType: InputType
  setCurrentType: (currentType: InputType) => void
  knowledge: Knowledge[]
  setKnowledge: (knowledge: Knowledge[]) => void
  randomSequence: boolean
  setRandomSequence: (randomSequence: boolean) => void
  showExplanation: boolean
  setShowExplanation: (showExplanation: boolean) => void
  matchCase: boolean
  setMatchCase: (matchCase: boolean) => void
}

export default function PopoverBody(
  {
    question,
    updateAttributes,
    setIsEditing,
    answers,
    setAnswers,
    rightAnswer,
    setRightAnswer,
    cost,
    setCost,
    currentType,
    setCurrentType,
    knowledge,
    setKnowledge,
    randomSequence,
    setRandomSequence,
    showExplanation,
    setShowExplanation,
    matchCase,
    setMatchCase
  }: PopoverBodyProps
) {

  const type_options: { value: InputType, label: string }[] = [
    {
      value: 'text',
      label: 'Текст',
    },
    {
      value: 'number',
      label: 'Число',
    },
    {
      value: 'select',
      label: 'Выбор',
    },
    {
      value: 'textarea',
      label: 'Развернутый',
    },
  ]

  return (
    <Form
      initialValues={question}
      onFinish={() => {
        updateAttributes({
          ...question,
          type: currentType,
          answers: answers,
          correct_answers: rightAnswer,
          random: randomSequence,
          knowledge: knowledge,
          cost: cost,
          show_explanation: showExplanation,
        } as Question);
        setIsEditing(false);
      }}
      size={'small'}
      labelAlign="left"
      labelWrap
    >
      <Flex gap={8} vertical>
        <Space split={<Divider style={{backgroundColor: 'red'}}/>} direction={'horizontal'} align={'start'}>
          <InputAnswersBody
            type={currentType}
            initialAnswers={question.options}
            answers={answers}
            setAnswers={setAnswers}
            rightAnswer={rightAnswer}
            setRightAnswer={setRightAnswer}
            matchCase={matchCase}
            setMatchCase={setMatchCase}
            randomSequence={randomSequence}
          />
          <Flex vertical>
            <QuestionTypeOptions options={type_options} currentType={currentType}
                                 onTypeChange={(value) => {
                                   setCurrentType(value as InputType)
                                 }}/>
            <QuestionCostOptions cost={cost} onCostChange={setCost}/>
            {currentType === 'select' &&
                <QuestionRandomOptions state={randomSequence} onStateChange={setRandomSequence}/>}
            <QuestionKnowledgeOptions knowledge={knowledge} setKnowledge={setKnowledge}/>
            <ShowExplanationButton showExplanation={showExplanation} setShowExplanation={setShowExplanation}/>
          </Flex>
        </Space>
        {showExplanation && <QuestionExplanationOptions/>}
        <Space style={{marginLeft: 'auto'}}>
          <SubmitButton setIsEditing={setIsEditing}/>
        </Space>
      </Flex>
    </Form>
  )
}