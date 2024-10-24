import {useState} from "react";
import {Button, Flex, Input} from "antd";
import {Input as InputPro} from "@ant-design/pro-editor";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

export default function CreateKnowledgeNode({onCreate, onCancel}: {
  onCreate: (name: string, description: string) => void;
  onCancel: () => void
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [valid, setValid] = useState(false);

  return (
    <Flex gap={4} vertical style={{background: 'white', padding: 4, borderRadius: 4}}>
      <Flex gap={8} align={'baseline'}>
        <InputPro
          value={name}
          onChange={(e) => {
            setValid(e.length > 4 && e.length < 20);
            setName(e);
          }}
          status={valid ? '' : 'error'}
          placeholder={'Название нового знания'}
          allowClear
        />
        <Button
          type={'text'} title={'Сохранить'} icon={<CheckOutlined/>}
          style={{color: valid ? 'green' : 'grey'}}
          onClick={() => {
            if (valid) {
              onCreate(name, description);
              onCancel();
            }
          }}
        />
      </Flex>
      <Flex gap={8} align={'start'}>
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={'Описание'}
          allowClear
          autoSize={{minRows: 3, maxRows: 5}}
          size={'small'}
        />
        <Button
          type={'text'} title={'Отмена'} icon={<CloseOutlined/>} style={{color: 'grey'}}
          onClick={onCancel} disabled={!valid}
        />
      </Flex>
    </Flex>
  )
}