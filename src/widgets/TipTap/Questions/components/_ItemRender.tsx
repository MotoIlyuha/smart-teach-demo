import {memo, ReactNode, useState} from "react";
import {Radio} from "antd";
import {useSortableList, Checkbox} from "@ant-design/pro-editor";
import {AnswerOption, QuestionType} from "../../../../shared/types/CourseTypes";
import {v4 as uuidv4} from 'uuid';
import ItemBody from "./ItemBody.tsx";

const Wrapper = ({children, type}: {children: ReactNode, type: QuestionType}) => {
    if (type === 'mono')
        return <Radio>{children}</Radio>
    else if (type === 'multi')
        return <Checkbox>{children}</Checkbox>
    else
        return <>{children}</>;
}

export const ItemRender = memo(({type, item, index}: {type: QuestionType; item: AnswerOption; index: number }) => {
    const instance = useSortableList();
    const [text, setText] = useState(item.text);

    const updateTitle = (_text?: string) => {
        if (!_text) return;
        console.log("updateTitle: ", {
            id: item.id,
            text: _text,
        });
        instance.updateItem({
            id: item.id,
            text: _text,
        }, index);
    };

    const handleNextFocus = () => {
        const value = instance.getValue() || [];
        if (index + 1 === value.length) {
            const id = uuidv4();
            instance.addItem({dataIndex: id, title: ``});
        }
        setTimeout(() => {
            const nextNodeEl = document.getElementById(`index-${index + 1}`);
            nextNodeEl?.focus();
        }, 0);
    };

    return (
      <Wrapper type={type}>
          <ItemBody
            item={item}
            index={index}
            handleNextFocus={handleNextFocus}
            text={text}
            setText={setText}
            updateTitle={updateTitle}
          />
      </Wrapper>
    )
});