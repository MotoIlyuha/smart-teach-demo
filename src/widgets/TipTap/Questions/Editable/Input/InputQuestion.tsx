import {useState} from "react";

import {Popover} from "antd";

import {AnswerOption, InputType, Question} from "../../../../../shared/types/CourseTypes";
import PreviewInput from "../../Preview/Input/PreviewInput";
import PopoverBody from "./components/PopoverBody.tsx";
import {useCourse} from "../../../../../shared/hok/Course.ts";

interface InputQuestionProps {
  question: Question
  updateAttributes: (attrs: Partial<Question>) => void
  setIsEditing: (isEditing: boolean) => void
}

export default function InputQuestion({question, updateAttributes, setIsEditing}: InputQuestionProps) {
  const {selectedLesson} = useCourse();
  const [answers, setAnswers] = useState<AnswerOption[]>(question.options);
  const [rightAnswer, setRightAnswer] = useState<string[]>(question.correctAnswerIds);
  const [cost, setCost] = useState(question.cost);
  const [currentType, setCurrentType] = useState<InputType>(question.type as InputType);
  const [knowledge, setKnowledge] = useState(question.requiredKnowledge || selectedLesson?.knowledge);
  const [randomSequence, setRandomSequence] = useState(question.shuffleOptions);
  const [showExplanation, setShowExplanation] = useState(false);
  const [matchCase, setMatchCase] = useState(question.caseSensitive);

  const updatedQuestion = {
    ...question,
    cost: cost,
    type: currentType,
    options: answers,
    knowledge: knowledge,
    random: randomSequence,
    correctAnswerIds: rightAnswer,
    shuffleOptions: randomSequence,
    caseSensitive: matchCase
  } as Question;

  return (
    <Popover content={
      <PopoverBody
        question={question}
        updateAttributes={updateAttributes}
        setIsEditing={setIsEditing}
        answers={answers}
        setAnswers={setAnswers}
        rightAnswer={rightAnswer}
        setRightAnswer={setRightAnswer}
        cost={cost}
        setCost={setCost}
        currentType={currentType}
        setCurrentType={setCurrentType}
        knowledge={knowledge}
        setKnowledge={setKnowledge}
        randomSequence={randomSequence}
        setRandomSequence={setRandomSequence}
        showExplanation={showExplanation}
        setShowExplanation={setShowExplanation}
        matchCase={matchCase}
        setMatchCase={setMatchCase}
      />} open={true}>
      <PreviewInput question={updatedQuestion}/>
    </Popover>
  )
}