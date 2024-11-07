import {useState} from "react";
import {Button, Flex, Input, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {Question} from "../../../../../shared/types/CourseTypes";

interface WelcomeProps {
  question: Question
  welcomeText: string
  setWelcomeText: (text: string) => void
}

export function Welcome({question, welcomeText, setWelcomeText}: WelcomeProps) {
  const [edited, setEdited] = useState(false);

  return (
    <>
      {edited ? (
        <Input.TextArea
          autoSize
          value={welcomeText}
          onChange={(e) => {
            setWelcomeText(e.target.value);
            setEdited(true);
          }}
          onBlur={() => {
            question.invitationText = welcomeText;
            setEdited(false);
          }}
          onPressEnter={() => {
            question.invitationText = welcomeText;
            setEdited(false);
          }}
        />
      ) : (
        <Flex gap={4} align={'baseline'} justify={'space-between'}>
          <Typography.Text strong onDoubleClick={() => setEdited(true)}>{welcomeText}</Typography.Text>
          <Button onClick={() => setEdited(true)} icon={<EditOutlined/>} type={'text'}/>
        </Flex>
      )}
    </>
  );
}