import {Tag, Tooltip, Select} from "antd";
import {Knowledge} from "../../../../shared/types/CourseTypes.ts";
import './PreviewKnowledge.css'

export default function PreviewKnowledge({knowledge}: { knowledge: Knowledge[] }) {

  const tag_colors = [
    "magenta", "red", "volcano", "orange", "gold",
    "lime", "green", "cyan", "blue", "geekblue", "purple"
  ]

  function getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * tag_colors.length);
    return tag_colors[randomIndex];
  }

  return (
    <Select
      // multiple
      style={{width: '100%'}}
      mode={'multiple'}
      defaultValue={knowledge}
      value={knowledge}
      options={[]}
      suffixIcon={<></>}
      variant={'borderless'}
      placeholder={'Для этого вопроса не требуются знания'}
      open={false}
      allowClear={false}
      maxTagCount={'responsive'}
      tagRender={({label}) => (
        <Tooltip title={label}>
          <Tag
            className={'knowledge-tag'}
            color={getRandomColor()}
            closable={false}
          >
            {label}
          </Tag>
        </Tooltip>
      )}
    />
  )
}