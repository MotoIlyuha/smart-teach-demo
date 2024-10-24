import {useCallback, useState} from "react";

import {Col, Divider, Flex, Form, Radio, Row} from "antd";
import {Checkbox, SortableList} from "@ant-design/pro-editor";

import {RandomSequenceIcon} from "../../components/RandomSequenceIcon.tsx";

import {ItemRender} from "../../components/_ItemRender";
import {Welcome} from "./Welcome";
import PreviewKnowledge from '../../../../Knowledge/components/Preview/PreviewKnowledge';
import {AnswerOption, ChoiceType, Question} from "../../../../../shared/types/CourseTypes";
import {
  QuestionTypeOptions,
  QuestionCostOptions,
  QuestionRandomOptions,
  QuestionKnowledgeOptions,
  SubmitButton,
  ShowExplanationButton,
  QuestionExplanationOptions
} from "../../components/QuestionOptions";
import {v4 as uuidv4} from 'uuid';

import styles from "./Question.module.css";
import {useCourse} from "../../../../../shared/hok/Course.ts";


interface ChoiceQuestionProps {
  question: Question
  updateAttributes: (attrs: Partial<Question>) => void
  setIsEditing: (isEditing: boolean) => void
}

export default function ChoiceQuestion({question, updateAttributes, setIsEditing}: ChoiceQuestionProps) {

  const shuffleArray = (array: AnswerOption[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const {selectedLesson} = useCourse();
  const [questionType, setQuestionType] = useState<ChoiceType>(question.type as ChoiceType);
  const [shuffledAnswers, setShuffledAnswers] = useState<AnswerOption[]>(question.options);
  const [correctAnswers, setCorrectAnswers] = useState(question.correctAnswerIds);
  const [randomSequence, setRandomSequence] = useState(question.shuffleOptions);
  const [knowledge, setKnowledge] = useState(question.requiredKnowledge || selectedLesson?.knowledge);
  const [showExplanation, setShowExplanation] = useState(false);
  const [cost, setCost] = useState<number>(question.cost || 0);
  const [welcomeText, setWelcomeText] = useState(question.invitationText ||
    (question.type === "mono" ? "Выберите один вариант" : "Выберите несколько вариантов")
  );

  const shuffleAnswers = () => {
    setShuffledAnswers(shuffleArray([...question.options]));
  };

  const VariantList = useCallback(() => (
    <SortableList<AnswerOption>
      initialValues={question.options}
      value={shuffledAnswers}
      onChange={(data: AnswerOption[]) => {
        setShuffledAnswers(data);
      }}
      renderContent={(item: AnswerOption, index) =>
        <ItemRender type={questionType} item={item as AnswerOption} index={index}/>
      }
      creatorButtonProps={{
        creatorButtonText: 'Новый вариант ответа',
        record: () => ({
          text: 'Вариант ' + (shuffledAnswers.length + 1),
          id: uuidv4()
        })
      }}
    />
  ), [question.options, questionType, shuffledAnswers])

  return (
    <Form
      initialValues={question}
      onFinish={() => {
        updateAttributes({
          ...question,
          type: questionType,
          options: shuffledAnswers,
          correctAnswerIds: correctAnswers,
          shuffleOptions: randomSequence,
          requiredKnowledge: knowledge,
          cost: cost,
          invitationText: welcomeText,
          caseSensitive: question.caseSensitive
        } as Question);
        setIsEditing(false);
      }}
      size={'small'}
      labelAlign="left"
      labelWrap
      labelCol={{span: 6}}
      wrapperCol={{span: 18}}
      className={styles.active}
    >
      <Row>
        <Col span={11}>
          <Flex gap={8} vertical>
            <Row align={'stretch'}>
              {/*<Col span={3}>*/}
              {/*	<Badge count={cost} color={'green'}/>*/}
              {/*</Col>*/}
              <Col span={24}>
                <Form.Item name='welcome_text' wrapperCol={{span: 24}} style={{margin: '0 8px 8px'}}>
                  <Welcome question={question} welcomeText={welcomeText} setWelcomeText={setWelcomeText}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 8]} align={'middle'}>
              <Col span={2}>
                <RandomSequenceIcon randomSequence={randomSequence} onClick={() => shuffleAnswers()}/>
              </Col>
              <Col span={22}>
                {questionType === "mono" ? (
                  <Radio.Group value={correctAnswers[0]} onChange={(e) => setCorrectAnswers(e.target.value)}>
                    <VariantList/>
                  </Radio.Group>
                ) : (
                  <Checkbox.Group value={correctAnswers}
                                  onChange={(e) => setCorrectAnswers(e.map(value => String(value)))}>
                    <VariantList/>
                  </Checkbox.Group>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <PreviewKnowledge knowledge={knowledge}/>
              </Col>
            </Row>
          </Flex>
        </Col>
        <Col span={1}>
          <Divider type={'vertical'} style={{height: '100%'}}/>
        </Col>
        <Col span={12}>
          <Flex vertical>
            <QuestionTypeOptions
              options={[
                {value: 'mono' as ChoiceType, label: 'Один вариант'},
                {value: 'multi' as ChoiceType, label: 'Несколько вариантов'}
              ]}
              currentType={questionType}
              onTypeChange={(type) => {
                setQuestionType(type as ChoiceType);
                setWelcomeText(type === "mono" ? "Выберите один вариант:" : "Выберите несколько вариантов:");
              }}
            />
            <QuestionCostOptions cost={cost} onCostChange={setCost}/>
            <QuestionRandomOptions state={randomSequence} onStateChange={setRandomSequence}/>
            <QuestionKnowledgeOptions knowledge={knowledge} setKnowledge={setKnowledge}/>
            <ShowExplanationButton showExplanation={showExplanation} setShowExplanation={setShowExplanation}/>
          </Flex>
        </Col>
      </Row>
      <Row gutter={[8, 16]}>
        <Col span={24}>
          {showExplanation && <QuestionExplanationOptions/>}
        </Col>
        <Col span={20}>
          <Flex justify={'end'} align={'middle'}>
            <SubmitButton setIsEditing={setIsEditing}/>
          </Flex>
        </Col>
      </Row>
    </Form>
  )
}
