import {EditorContentProps} from "@tiptap/react";
import {QuestionWithAnswer} from "../../../shared/types/CourseTypes.ts";

export const getQuestions = (editor: EditorContentProps["editor"]): QuestionWithAnswer[] => {
  if (!editor) return [];
  const questions: QuestionWithAnswer[] = [];
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'reactComponent') {
      questions.push(node.attrs.content as QuestionWithAnswer);
    }
    return true;
  });
  return questions;
};