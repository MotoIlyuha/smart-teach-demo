import {useState} from "react";
import {Badge, Button, Checkbox, Col, Flex, Radio, Row, Typography} from "antd";
import PreviewKnowledge from "../../../../Knowledge/components/Preview/PreviewKnowledge";
import styles from "../../Preview/Choice/PreviewChoise.module.css";
import {QuestionWithAnswer} from "../../../../../shared/types/CourseTypes.ts";
import {shuffle} from "../../../../../shared/utils/shuffleArray.ts";

interface TestChoiceProps {
  question: QuestionWithAnswer
  updateAttributes: (attrs: Partial<QuestionWithAnswer>) => void
}

export default function TestChoice({question, updateAttributes}: TestChoiceProps) {
  const [changed, setChanged] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);

  return (
    <Flex gap={8} vertical style={{userSelect: 'none'}}>
      <Row gutter={[8, 8]} align={'middle'}>
        <Col>
          <Badge count={question.cost} color={'green'}/>
        </Col>
        <Col>
          <Typography.Text strong>{question.invitationText}</Typography.Text>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col offset={2}>
          {question.type === 'mono' ? (
            <Radio.Group
              onChange={(e) => {
                updateAttributes({...question, userAnswerIds: [e.target.value], shuffleOptions: false});
                setChanged(true);
                setAnswers([e.target.value]);
              }}
              value={answers[0]}
            >
              <Flex gap={8} vertical>
                {shuffle(question.options, question.shuffleOptions).map((answer, index) => (
                  <Radio key={index} value={answer.id}>
                    {answer.text}
                  </Radio>
                ))}
              </Flex>
            </Radio.Group>
          ) : (
            <Checkbox.Group
              className={styles.checkboxGroup}
              value={answers}
              onChange={(e) => {
                updateAttributes({...question, userAnswerIds: e, shuffleOptions: false});
                setChanged(true);
                setAnswers(e);
              }}>
              {shuffle(question.options, question.shuffleOptions).map((answer, index) => (
                <Checkbox key={index} value={answer.id}>
                  {answer.text}
                </Checkbox>
              ))}
            </Checkbox.Group>
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <PreviewKnowledge knowledge={question.requiredKnowledge}/>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {changed && (
            <Button
              type="link"
              onClick={() => {
                updateAttributes({...question, userAnswerIds: []});
                setChanged(false);
                setAnswers([]);
              }}
            >
              Сбросить ответ
            </Button>
          )}
        </Col>
      </Row>
    </Flex>
  )
}