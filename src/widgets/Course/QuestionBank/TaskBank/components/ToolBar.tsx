import {Button, Segmented} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useLayout} from "../../../../../shared/hok/Layout.ts";

export const CreateTaskButton = () => {
  const {setTaskEditMode} = useLayout();

  return (
    <Button type={'primary'} icon={<PlusOutlined/>} onClick={() => setTaskEditMode(true)}>
      Добавить задание
    </Button>
  )
}

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