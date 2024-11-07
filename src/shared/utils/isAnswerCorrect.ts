import {QuestionType} from "../types/CourseTypes.ts";

export default function isAnswerCorrect(userAnswer: string[], correctAnswer: string[], type: QuestionType): boolean {
  try {
    switch (type) {
      case "mono":
        return userAnswer[0] === correctAnswer[0];
      case "multi":
        return userAnswer.sort().join('') === correctAnswer.sort().join('');
      case "text":
        return correctAnswer.includes(userAnswer[0]);
      case "textarea":
        return correctAnswer.includes(userAnswer[0]);
      case "select":
        return userAnswer.sort().join('') === correctAnswer.sort().join('');
      case "number":
        if (correctAnswer.length === 1)
          return correctAnswer.includes(String(Number(userAnswer[0])));
        else {
          const a = Number(correctAnswer[0]);
          const b = Number(correctAnswer[1]);
          return a <= Number(userAnswer) && Number(userAnswer) <= b;
        }
      case "sort":
        return userAnswer.sort().join('') === correctAnswer.sort().join('');
      case "transfer":
        return false;
      default:
        return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}