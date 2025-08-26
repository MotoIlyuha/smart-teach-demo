import {Badge, Input, InputNumber, Popover, Select} from "antd";
import {QuestionWithAnswer} from "../../../../../shared/types/CourseTypes.ts";
import isAnswerCorrect from "../../../../../shared/utils/isAnswerCorrect.ts";

export default function ResultInput({question}: { question: QuestionWithAnswer }) {
  const user_points = isAnswerCorrect(question.userAnswerIds, question.correctAnswerIds, question.type) ? question.cost : 0;
  const success = user_points === question.cost;

  const correctAnswer = question.type === 'number' && question.correctAnswerIds.length > 1 ?
    `от ${Number(question.correctAnswerIds[0])} до ${Number(question.correctAnswerIds[1])}` :
    question.correctAnswerIds.join(', ');
  const success_color = 'rgba(0, 128, 0, 0.1)';
  const error_color = 'rgba(255, 0, 0, 0.1)';
  const style = {
    backgroundColor: success ? success_color : error_color,
    minWidth: 120
  };

  return (
    <Badge.Ribbon
      color={success ? 'green' : 'red'}
      text={user_points + (!success ? ' / ' + question.cost : '')}
      placement={'end'}
      style={{top: -10}}
    >
      <Popover
        content={question.explanation}
        title={"Правильный ответ: " + correctAnswer}
        trigger="hover"
      >
        {question.type === 'text' &&
            <Input
                value={question.userAnswerIds[0]}
                status={success ? '' : 'error'}
                style={style}
            />
        }
        {question.type === 'number' &&
            <InputNumber
                value={question.userAnswerIds[0]}
                status={success ? '' : 'error'}
                style={style}
            />
        }
        {question.type === 'select' &&
            <Select
                value={question.userAnswerIds}
                mode={(question.userAnswerIds || []).length > 1 ? 'multiple' : undefined}
                status={success ? '' : 'error'}
                style={style}
            />
        }
        {question.type === 'textarea' &&
            <Input.TextArea
                value={question.userAnswerIds[0]}
                status={success ? '' : 'error'}
                style={style}
            />
        }
      </Popover>
    </Badge.Ribbon>
  )
}