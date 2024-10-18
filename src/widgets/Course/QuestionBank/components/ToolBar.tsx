import {PlusOutlined} from "@ant-design/icons";
import {Button, Segmented} from "antd";

export const CreateTaskButton = () => (
  <Button type={'primary'} icon={<PlusOutlined/>} onClick={() => {}}>
    Добавить задание
  </Button>
)

export const PublicSwitch = () => (
  <Segmented<string>
    size={'large'}
    defaultValue={'local'}
    options={[{label: 'Локальные', value: 'local'},
      {label: 'Публичные', value: 'public', disabled: true}]}
    onChange={(value) => {
      console.log(value);
    }}
  />
)