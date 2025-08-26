import {useCallback, useState} from "react";
import {Badge, Checkbox, Col, Flex, Radio, Row, Typography} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import PreviewKnowledge from "../../../../Knowledge/components/Preview/PreviewKnowledge.tsx";
import {ShowExplanationButton} from "../../components/QuestionOptions.tsx";
import {QuestionWithAnswer} from "../../../../../shared/types/CourseTypes.ts";
import isAnswerCorrect from "../../../../../shared/utils/isAnswerCorrect.ts";
import styles from "../../Preview/Choice/PreviewChoise.module.css";

export default function ResultChoice({question}: { question: QuestionWithAnswer }) {

  const user_points = isAnswerCorrect(question.userAnswerIds, question.correctAnswerIds, question.type) ? question.cost : 0;
  const success = user_points === question.cost;
  const [showExplanation, setShowExplanation] = useState(!success);
  
  const AnswerIcon = useCallback(({answer}: {answer: string}) => {
    if (question.userAnswerIds.includes(answer) && question.correctAnswerIds.includes(answer)) 
      return <CheckOutlined style={{color: 'green'}}/>;
    if (question.userAnswerIds.includes(answer) && !question.correctAnswerIds.includes(answer)) 
      return <CloseOutlined style={{color: 'red'}}/>;
    return <CloseOutlined style={{color: 'transparent'}}/>;
  }, [question.correctAnswerIds, question.userAnswerIds])

  return (
    <Badge.Ribbon
      color={success ? 'green' : 'red'}
      text={'Набрано баллов: ' +  user_points + (!success ? ' / ' + question.cost : '')}
      placement={'end'}
      style={{top: -10}}
    >
      <Flex gap={8} vertical style={{userSelect: 'none', border: '1px solid #00000023', padding: 12, borderRadius: 8}}>
        <Row gutter={[8, 8]} align={'middle'}>
          <Col>
            <Typography.Text strong>{question.invitationText}</Typography.Text>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col>
            {question.type === 'mono' ? (
              <Radio.Group className={styles.groupDisabled} defaultValue={question.userAnswerIds[0]} disabled>
                <Flex gap={8} vertical>
                  {question.options.map((answer, index) => (
                    <Flex gap={8} key={index}>
                      <AnswerIcon answer={answer.id}/>
                      <Radio className={styles.wrapperDisabled} key={index} value={answer.id}
                             checked={(question.userAnswerIds || []).includes(answer.id)}>
                        <Typography.Text strong={question.correctAnswerIds[0] === answer.id}>
                          {answer.text}
                        </Typography.Text>
                      </Radio>
                    </Flex>
                  ))}
                </Flex>
              </Radio.Group>
            ) : (
              <Checkbox.Group className={styles.groupDisabled + " " + styles.checkboxGroup}
                              defaultValue={question.userAnswerIds} disabled>
                {question.options.map((answer, index) => (
                  <Flex gap={8} key={index}>
                    <AnswerIcon answer={answer.id}/>
                    <Checkbox className={styles.wrapperDisabled} key={index} value={answer.id}
                              checked={(question.userAnswerIds || []).includes(answer.id)}>
                      <Typography.Text strong={question.correctAnswerIds?.includes(answer.id)}>
                        {answer.text}
                      </Typography.Text>
                    </Checkbox>
                  </Flex>
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
            {question.explanation && (
              <Flex gap={8} vertical>
                <ShowExplanationButton setShowExplanation={setShowExplanation} showExplanation={showExplanation}/>
                {showExplanation && <Typography.Text>{question.explanation}</Typography.Text>}
              </Flex>
            )}
          </Col>
        </Row>
      </Flex>
    </Badge.Ribbon>
  )
}