import {Knowledge} from "../../../shared/types/CourseTypes.ts";

export default function KnowledgeTreeItem (nodes: Knowledge[]) {
  return (
    <div>
      {nodes.toString()}
    </div>
  )
}