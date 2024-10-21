import {Input} from "@ant-design/pro-editor";
import {AnswerOption} from "../../../../shared/types/CourseTypes.ts";
import {useState} from "react";

interface ItemBodyProps {
  item: AnswerOption;
  index: number;
  handleNextFocus: () => void;
  updateTitle: (title?: string) => void;
  text: string;
  setText: (text: string) => void;

}

export default function ItemBody({item, index, handleNextFocus, updateTitle, text, setText}: ItemBodyProps) {
  const [changed, setChanged] = useState(false);

  return (
    <Input
      id={`index-${index}`}
      defaultValue={item.text}
      value={text}
      placeholder="Вариант ответа..."
      onBlur={() => {
        if (changed) updateTitle();
      }}
      onPressEnter={() => {
        if (changed) updateTitle();
        handleNextFocus();
      }}
      onValueChanging={(value) => {
        console.log("valueChange: ", value);
        setText(value);
        setChanged(true);
      }}
      onChange={(value) => {
        console.log("change: ", value);
        setText(value);
        setChanged(true);
        updateTitle(value);
      }}
    />
  )
}