import {useShallow} from "zustand/react/shallow";
import {Tag, Tooltip} from "antd";
import {TreeSelect} from "@ant-design/pro-editor";
import {Knowledge} from "../../../../shared/types/CourseTypes.ts";
import {useKnowledgeStore} from "../../../../shared/stores/knowledgeStore.ts";
import {convertToTreeData} from "../../../../shared/utils/buildKnowledgeTree.ts";
import './PreviewKnowledge.css'

export default function PreviewKnowledge({knowledge}: { knowledge: Knowledge[] }) {
  const {knowledgeTree, knowledgeList} = useKnowledgeStore(useShallow((set) => ({
    knowledgeTree: set.knowledgeTree,
    knowledgeList: set.knowledgeList
  })));

  if (!knowledgeTree || !knowledgeList) return null;

  const tag_colors = [
    "magenta", "red", "volcano", "orange", "gold",
    "lime", "green", "cyan", "blue", "geekblue", "purple"
  ]

  function getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * tag_colors.length);
    return tag_colors[randomIndex];
  }

  return (
    <TreeSelect
      multiple
      style={{width: '100%'}}
      value={knowledge.map(k => k.id)}
      treeData={convertToTreeData(knowledgeTree)}
      suffixIcon={<></>}
      variant={'borderless'}
      placeholder={'Для этого вопроса не требуются знания'}
      open={false}
      allowClear={false}
      maxTagCount={'responsive'}
      tagRender={({value}) => {
        const _knowledge = knowledgeList.find((k) => k.id === value);
        if (!_knowledge) return <></>;
        const {name, description} = _knowledge;
        return (
          <Tooltip title={`${name}${description ? ': ' + description : ''}`}>
            <Tag
              className={'knowledge-tag'}
              color={getRandomColor()}
              closable={false}
            >
              {name}
            </Tag>
          </Tooltip>
        )
      }}
    />
  )
}