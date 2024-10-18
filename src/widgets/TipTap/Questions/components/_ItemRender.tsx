import {memo, useState} from "react";
import {Radio} from "antd";
import {useSortableList, Checkbox, Input} from "@ant-design/pro-editor";
import {AnswerOption, QuestionType} from "../../../../shared/types/CourseTypes";
import {v4 as uuidv4} from 'uuid';

export const ItemRender = memo(({type, item, index}: {type: QuestionType; item: AnswerOption; index: number }) => {
    const instance = useSortableList();
    const [title, setTitle] = useState(item.text);
    const [changed, setChanged] = useState(false);

    const updateTitle = (_title?: string) => {
        if (!_title) return;
        console.log("updateTitle: ", {
            dataIndex: item.id,
            title: _title,
        });
        instance.updateItem({
            dataIndex: item.id,
            title: _title,
        }, index);
        setChanged(false);
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

    const Body = () => (
        <Input
            id={`index-${index}`}
            defaultValue={item.text}
            value={title}
            placeholder="Вариант ответа..."
            onChange={(value) => {
                console.log("change: ", value);
                setTitle(value);
                setChanged(true);
                updateTitle(value);
            }}
            onBlur={() => {
                if (changed) updateTitle();
            }}
            onPressEnter={() => {
                if (changed) updateTitle();
                handleNextFocus();
            }}
            // onValueChanging={(value) => {
            //     console.log("valueChange: ", value);
            //     setTitle(value);
            //     setChanged(true);
            // }}
        />
    );

    if (type === 'mono')
        return <Radio value={item.text}><Body/></Radio>
    else if (type === 'multi')
        return <Checkbox value={item.text}><Body/></Checkbox>
    else return <Body/>;
});