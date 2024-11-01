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
    "text": "Вариант 3",
    "id": "e9026a18-9653-4f70-a044-d92041556afb"
  },
  {
    "text": "Вариант 4",
    "id": "a644984a-7c63-43ec-9483-3633820b5bae"
  }
          ],
          "correctAnswerIds": [
  "Вариант 2",
  "e9026a18-9653-4f70-a044-d92041556afb"
],
          "shuffleOptions": true
        },
        "meta": {
          "edit": true
        }
      }
  }`)
