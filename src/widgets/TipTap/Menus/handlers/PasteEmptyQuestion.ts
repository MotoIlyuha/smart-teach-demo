import {ChoiceType, QuestionType} from "../../../../shared/types/CourseTypes.ts";
import {v4 as uuidv4} from 'uuid';

const welcomeText = (type: ChoiceType) => (
  type === 'mono' ? "Выберите один из вариантов ответа:" : "Выберите несколько вариантов ответа:"
)

export const pasteEmptyQuestion = (type: QuestionType) =>
  JSON.parse(
    `{
      "type": "reactComponent",
      "attrs": {
        "content": {
          "id": "${uuidv4()}",
          "type": "${type}",
          "cost": 1,
          "invitationText": "${welcomeText(type as ChoiceType)}",
          "requiredKnowledge": ["math"],
          "explanation": "Это тестовый вопрос",
          "options": [
            {
              "id": "Вариант 1",
              "text": "Вариант 1"
            },
            {
              "id": "Вариант 2",
              "text": "Вариант 2"
            },
  {
    "id": "Вариант 3",
    "text": "Вариант 3"
  },
  {
    "text": "Вариант 4",
    "id": "Вариант 4"
  }
          ],
          "correctAnswerIds": [
  "Вариант 2",
  "Вариант 3"
],
          "shuffleOptions": true
        },
        "meta": {
          "edit": true
        }
      }
  }`)
