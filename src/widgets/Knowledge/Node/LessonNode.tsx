import {memo} from 'react';
import {Handle, Position} from '@xyflow/react';
import {Lesson} from "../../../shared/types/CourseTypes.ts";
import {Flex, Typography} from "antd";
import {typeIcon} from "../../../shared/config/lessonTypeIcons.tsx";
import styles from "./LessonNode.module.css";

export const LessonNode = memo(({data, isConnectable}: { data: Lesson; isConnectable: boolean }) => {
  // console.log('DATA', data);

  return (
    <>
      <Flex className={styles.node} gap={8} vertical>
        <Typography.Title level={5}>{data?.title}</Typography.Title>
        <Typography.Text>{typeIcon[data?.type]?.label || 'default'}</Typography.Text>
      </Flex>
      <Handle
        type="target"
        position={Position.Left}
        style={{background: '#555'}}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{top: 10, background: '#555'}}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{bottom: 10, top: 'auto', background: '#555'}}
        isConnectable={isConnectable}
      />
    </>
  );
});