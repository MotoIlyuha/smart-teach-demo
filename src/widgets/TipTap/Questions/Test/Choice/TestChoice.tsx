import {Badge, Checkbox, Col, Flex, Radio, Row, Typography} from "antd";
import {Question} from "../../../../../shared/types/CourseTypes";
import {PreviewKnowledge} from "../../../../Knowledge/components/Preview/PreviewKnowledge";
import {useState} from "react";

export function TestChoice({question, updateAttributes}: {
  question: Question,
  updateAttributes: (attrs: Question) => void
}) {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

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
                setUserAnswers([e.target.value]);
                question.userAnswers = [e.target.value];
                updateAttributes({...question, userAnswers: [e.target.value]});
              }} value={userAnswers[0]}>
              <Flex gap={8} vertical>
                {question.options.map((answer, index) => (
                  <Radio key={index} value={answer.id}>
                    {answer.text}
                  </Radio>
                ))}
              </Flex>
            </Radio.Group>
          ) : (
            <Checkbox.Group value={userAnswers}
                            onChange={(e) => {
                              setUserAnswers(e);
                              question.userAnswers = e;
                              updateAttributes({...question, userAnswers: e});
                            }}>
              {question.options.map((answer, index) => (
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
    </Flex>
  )
}