import {memo} from "react";
import {Node} from "@tiptap/core";
import {
  ChoiceType,
  ChoiceTypes,
  InputType,
  InputTypes,
  Question,
  QuestionWithAnswer
} from "../../../../shared/types/CourseTypes.ts";
import ChoiceQuestion from "../Editable/Choice/ChoiceQuestion.tsx";
import InputQuestion from "../Editable/Input/InputQuestion.tsx";
import PreviewChoice from "../Preview/Choice/PreviewChoice.tsx";
import PreviewInput from "../Preview/Input/PreviewInput.tsx";
import TestChoice from "../Test/Choice/TestChoice.tsx";
import TestInput from "../Test/Input/TestInput.tsx";
import ResultChoice from "../Result/Choice/ResultChoice.tsx";
import ResultInput from "../Result/Input/ResultInput.tsx";

export interface ReactComponentProps<T> {
  node: Node & {
    attrs: {
      content: T,
      edit: boolean
    }
  }
  updateAttributes: (attrs: Partial<Question>) => void
}

interface QuestionMemoProps {
  question: Question;
  updateAttributes: (attrs: Partial<Question>) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const QuestionMemo = memo(({question, updateAttributes, setIsEditing}: QuestionMemoProps) => {
  if (ChoiceTypes.includes(question.type as ChoiceType))
    return <ChoiceQuestion
      question={question}
      updateAttributes={updateAttributes}
      setIsEditing={setIsEditing}
    />;
  else if (InputTypes.includes(question.type as InputType))
    return <InputQuestion
      question={question}
      updateAttributes={updateAttributes}
      setIsEditing={setIsEditing}
    />;
});

export const PreviewMemo = memo(({question}: { question: Question }) => {
  if (ChoiceTypes.includes(question.type as ChoiceType))
    return <PreviewChoice question={question}/>;
  else if (InputTypes.includes(question.type as InputType))
    return <PreviewInput question={question}/>;
});

interface TestMemoProps {
  question: QuestionWithAnswer
  updateAttributes: (attrs: Partial<QuestionWithAnswer>) => void
}

export const TestMemo = memo(({question, updateAttributes}: TestMemoProps) => {
  if (ChoiceTypes.includes(question.type as ChoiceType))
    return <TestChoice question={question} updateAttributes={updateAttributes}/>;
  else if (InputTypes.includes(question.type as InputType))
    return <TestInput question={question} updateAttributes={updateAttributes}/>;
});

export const ResultMemo = memo(({question}: { question: QuestionWithAnswer }) => {
  if (ChoiceTypes.includes(question.type as ChoiceType))
    return <ResultChoice question={question}/>;
  else if (InputTypes.includes(question.type as InputType))
    return <ResultInput question={question}/>;
});