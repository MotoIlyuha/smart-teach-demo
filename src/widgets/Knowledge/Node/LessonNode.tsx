import {memo} from 'react';
import {Handle, Position, useConnection} from '@xyflow/react';
import {Lesson} from "../../../shared/types/CourseTypes.ts";
import {Flex, Typography} from "antd";
import {typeIcon} from "../../../shared/config/lessonTypeIcons.tsx";
import styles from "./LessonNode.module.css";

export const LessonNode = memo(({data}: { data: Lesson; }) => {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== data.id;
  const label = isTarget ? 'Drop here' : 'Drag to connect';

  return (
    <div className={styles.customNode}>
      <Flex className={styles.node + ' ' + styles.customNodeBody} gap={8} vertical style={{
        borderStyle: isTarget ? 'dashed' : 'solid',
        backgroundColor: isTarget ? '#ffcce3' : '#ccd9f6',
      }}>
        <Typography.Title level={5}>{data?.title}</Typography.Title>
        <Typography.Text>{typeIcon[data?.type]?.label || 'default'}</Typography.Text>
        <Typography.Text>{label}</Typography.Text>
      </Flex>
      {!connection.inProgress && (
        <Handle
          className={styles.customHandle}
          position={Position.Right}
          type="source"
        />
      )}
      {/* We want to disable the target handle, if the connection was started from this node */}
      {(!connection.inProgress || isTarget) && (
        <Handle className={styles.customHandle} position={Position.Left} type="target" isConnectableStart={false}/>
      )}
    </div>
  );
});