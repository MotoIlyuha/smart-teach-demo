import React, { useMemo, useState, useEffect, Key } from "react";
import { useShallow } from "zustand/react/shallow";
import { Input, Tree, Typography, Button } from "antd";
import {Input as ProInput, TreeProps} from "@ant-design/pro-editor";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useKnowledgeStore } from "../../shared/stores/knowledgeStore.ts";
import type { DataNode } from "antd/es/tree";
import { Knowledge } from "../../shared/types/CourseTypes.ts";

const { Search } = Input;

interface CustomDataNode extends DataNode {
  render: React.ReactNode;
  children?: CustomDataNode[];
  isApproved?: boolean;
}

const convertToTreeData = (nodes: Knowledge[], handleNodeEdit: (id: Key, name: string) => void): CustomDataNode[] => {
  return nodes.map((node) => ({
    key: node.id,
    title: node.name + '|||' + node.description + '|||' + (node.isApproved ? '1' : '0'),
    isApproved: node.isApproved,
    render: node.isApproved ? (
      <Typography.Text strong>{node.name}</Typography.Text>
      // <Input value={node.name} />
    ) : (
      <ProInput
        defaultValue={node.name}
        onBlur={(e) => handleNodeEdit(node.id, e.target.value)}
      />
    ),
    children: node.children ? convertToTreeData(node.children, handleNodeEdit) : [],
  }));
};

const getParentKey = (key: Key, tree: CustomDataNode[]): Key | undefined => {
  let parentKey: Key | undefined;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const KnowledgeTree = () => {
  const { knowledgeTree, fetchKnowledgeTree } = useKnowledgeStore(useShallow(state => ({
    knowledgeTree: state.knowledgeTree,
    fetchKnowledgeTree: state.fetchKnowledgeTree
  })));
  const [treeData, setTreeData] = useState<CustomDataNode[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  useEffect(() => {
    fetchKnowledgeTree();
  }, [fetchKnowledgeTree]);

  const handleAddNode = () => {
    const newNode: CustomDataNode = {
      key: `new_node_${Date.now()}`,
      title: "New Node",
      render: <Input defaultValue="New Node" />,
      children: [],
    };
    setTreeData((prevData) => [...prevData, newNode]);
  };

  const handleNodeEdit = (key: Key, newName: string) => {
    setTreeData((prevData) =>
      prevData.map((node) =>
        node.key === key ? { ...node, title: newName, render: <Input defaultValue={newName} /> } : node
      )
    );
  };

  useMemo(() => {
    if (knowledgeTree)
      setTreeData(convertToTreeData(knowledgeTree, handleNodeEdit));
  }, [knowledgeTree]);

  const dataList: { key: Key; title: string }[] = [];
  const generateList = (data: CustomDataNode[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title: (title as string).toLowerCase() });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(treeData);

  const onExpand = (newExpandedKeys: Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: DataNode[], key: Key, callback: (item: DataNode, index: number, arr: DataNode[]) => void) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    const data = [...treeData];

    // Найдем перетаскиваемый узел
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    // Найдем место, куда нужно поместить узел
    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj!);
      });
    } else if (
      (info.node.children || []).length > 0 &&
      info.node.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj!);
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }

    setTreeData(data);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const lowerCaseValue = value.toLowerCase();
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(lowerCaseValue) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self): item is Key => !!(item && self.indexOf(item) === i));
    setExpandedKeys(newExpandedKeys);
    setSearchValue(lowerCaseValue);
    setAutoExpandParent(true);
  };

  const processedTreeData = useMemo(() => {
    const loop = (data: CustomDataNode[]): CustomDataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.toLowerCase().indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span key={item.key}>
              {beforeStr}
              <span style={{color: '#f50'}}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span key={item.key}>{strTitle}</span>
          );
        if (item.children) {
          return { ...item, title, children: loop(item.children) };
        }

        return {
          ...item,
          title,
        };
      });

    return loop(treeData);
  }, [searchValue, treeData]);

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Найти знание"
        onChange={onChange}
        enterButton={<SearchOutlined />}
      />
      <Tree
        treeData={processedTreeData.map(({ render, ...node }) => ({ ...node, title: render }))}
        selectable
        selectedKeys={selectedKeys}
        onSelect={(keys) => setSelectedKeys(keys)}
        // draggable={(node) => node.title.toString()}
        titleRender={(node) => {
          console.log(knowledgeTree?.filter(tr => tr.id === node.key))
          // return knowledgeTree?.filter(tr => tr.id === node.key)?.[0]?.name
          return node.title;
        }}
        onDrop={onDrop}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddNode}
      >
        Добавить
      </Button>
    </div>
  );
};

export default KnowledgeTree;
