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
          "requiredKnowledge": [],
          "options": [
            {
              "id": "Вариант 1",
              "text": "1"
            },
            {
              "id": "Вариант 2",
              "text": "2"
            }
          ],
          "correctAnswerIds": [
            "1"
          ],
          "shuffleOptions": true
        },
        "meta": {
          "edit": true
        }
      }
  }`)
