import {useState} from "react";
import {Flex, Space, Tag, Typography} from "antd";
import {ActionIcon, DeleteAction} from "@ant-design/pro-editor";
import {EllipsisOutlined} from "@ant-design/icons";

interface KnowledgeNodeProps {
  title: string;
  description?: string;
  searchValue: string;
  isApproved: boolean;
  onDelete: () => void;
  selected: boolean;
}

export default function KnowledgeNode(
  {
    title,
    description,
    isApproved,
    onDelete,
    searchValue,
    selected
  }: KnowledgeNodeProps) {
  const [showDescription, setShowDescription] = useState(false);

  // Логика выделения совпадающего текста
  const index = title.toLowerCase().indexOf(searchValue.toLowerCase());
  const beforeStr = title.substring(0, index);
  const afterStr = title.slice(index + searchValue.length);
  const highlightedTitle =
    index > -1 ? (
      <Typography.Text>
        {beforeStr}
        <span style={{backgroundColor: "yellow"}}>{searchValue}</span>
        {afterStr}
      </Typography.Text>
    ) : (
      title
    );

  return (
    <Space direction="vertical"
           style={{backgroundColor: !isApproved ? 'lightyellow' : 'transparent', borderRadius: 4, padding: 4}}>
      <Flex gap={8} align={'baseline'}>
        {selected ?
          <Tag color={'blue'} style={{textWrap: 'nowrap'}}>{highlightedTitle}</Tag>
          :
          <Typography.Text strong style={{textWrap: 'nowrap'}}>{highlightedTitle}</Typography.Text>
        }
        {description && (
          <ActionIcon
            icon={<EllipsisOutlined/>}
            title="Показать описание"
            onClick={(e) => {
              e.stopPropagation();
              setShowDescription(!showDescription);
            }}
          />
        )}
        {!isApproved && (
          <DeleteAction
            title="Удалить"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        )}
      </Flex>
      {showDescription && description && (
        <Typography.Text type="secondary">{description}</Typography.Text>
      )}
    </Space>
  );
}