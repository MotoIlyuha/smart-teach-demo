import {ChangeEvent, Key, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {useShallow} from "zustand/react/shallow";
import {Button, Flex, Input, Tree} from "antd";
import {TreeProps} from "@ant-design/pro-editor";
import type {DataNode} from "antd/es/tree";
import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {useKnowledgeStore} from "../../shared/stores/knowledgeStore.ts";
import {Knowledge} from "../../shared/types/CourseTypes.ts";
import CreateKnowledgeNode from "./components/CreateKnowledgeNode.tsx";
import KnowledgeNode from "./components/KnowledgeNode.tsx";
import {useCourse} from "../../shared/hok/Course.ts";

const {Search} = Input;

interface CustomDataNode extends DataNode {
  render: ReactNode;
  description?: string | null;
  children?: CustomDataNode[];
  isApproved: boolean;
}

const convertToTreeData = (
  nodes: Knowledge[],
  handleNodeEdit: (id: Key, name: string) => void,
  handleNodeDelete: (id: Key) => void,
  searchValue: string,
  selected: boolean
): CustomDataNode[] => {
  return nodes.map((node) => ({
    key: node.id,
    title: node.name,
    description: node.description,
    isApproved: node.isApproved,
    render: (
      <KnowledgeNode
        title={node.name}
        description={node.description ?? ''}
        isApproved={node.isApproved}
        searchValue={searchValue}
        selected={selected}
        onDelete={() => handleNodeDelete(node.id)}
      />
    ),
    children: node.children ? convertToTreeData(node.children, handleNodeEdit, handleNodeDelete, searchValue, selected) : [],
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
  const {setSelectedKnowledge, selectedKnowledge, selectMode} = useCourse();
  const {knowledgeTree, fetchKnowledgeTree, knowledgeList} = useKnowledgeStore(useShallow(state => ({
    knowledgeTree: state.knowledgeTree,
    fetchKnowledgeTree: state.fetchKnowledgeTree,
    knowledgeList: state.knowledgeList
  })));
  const [treeData, setTreeData] = useState<CustomDataNode[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [createNodeVisible, setCreateNodeVisible] = useState(false);

  useEffect(() => {
    fetchKnowledgeTree();
  }, [fetchKnowledgeTree]);

  const handleAddNode = (name: string, description: string) => {
    const newKey = `new_node_${Date.now()}`;
    const newNode: CustomDataNode = {
      isApproved: false,
      key: newKey,
      title: name,
      description: description,
      render: (
        <KnowledgeNode
          title={name}
          description={description}
          searchValue={searchValue}
          isApproved={false}
          selected={false}
          onDelete={() => handleNodeDelete(newKey)}
        />
      ),
      children: []
    };
    setTreeData((prevData) => [...prevData, newNode]);
  };

  const handleNodeDelete = useCallback((key: Key) => {
    setTreeData((prevData) => {
      const deleteNode = (nodes: CustomDataNode[]): CustomDataNode[] => {
        return nodes
          .map(node => ({...node}))
          .filter(node => {
            // Если узел соответствует ключу, удаляем его
            if (node.key === key) return false;
            // Если у узла есть дети, рекурсивно обрабатываем их
            if (node.children) {
              node.children = deleteNode(node.children);
            }
            return true;
          });
      };
      return deleteNode(prevData);
    });
  }, []);

  const handleNodeEdit = useCallback((key: Key, newName: string) => {
    setTreeData((prevData) =>
      prevData.map((node) =>
        node.key === key
          ? {
            ...node,
            title: newName,
            render: (
              <KnowledgeNode
                title={newName}
                description={node.description ?? ''}
                isApproved={!node.isApproved}
                searchValue={searchValue}
                selected={selectedKeys.includes(node.key)}
                onDelete={() => handleNodeDelete(key)}
              />
            ),
          }
          : node
      )
    );
  }, [handleNodeDelete, searchValue, selectedKeys]);

  useMemo(() => {
    if (knowledgeTree)
      setTreeData(convertToTreeData(knowledgeTree, handleNodeEdit, handleNodeDelete, searchValue, false));
  }, [handleNodeDelete, handleNodeEdit, knowledgeTree, searchValue]);

  const dataList: { key: Key; title: string }[] = [];
  const generateList = (data: CustomDataNode[]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const {key, title} = node;
      dataList.push({key, title: (title as string).toLowerCase()});
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

    if (knowledgeList?.find((node) => node.id === dragKey)?.isApproved) return null;

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
      let i: number;
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        if (dropPosition === -1) {
          item.children.splice(0, 0, dragObj!);
        } else {
          item.children.splice(i! + 1, 0, dragObj!);
        }
      });
    }

    setTreeData(data);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
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
      data.map((item) => ({
        ...item,
        render: (
          <KnowledgeNode
            title={item.title as string}
            description={item.description ?? ''}
            isApproved={item.isApproved}
            searchValue={searchValue}
            selected={selectedKeys.includes(item.key)}
            onDelete={() => handleNodeDelete(item.key)}
          />
        ),
        children: item.children ? loop(item.children) : [],
      }));

    return loop(treeData);
  }, [treeData, searchValue, selectedKeys, handleNodeDelete]);


// Функция для рекурсивного преобразования всех узлов
  const transformTreeData = (data: CustomDataNode[]): CustomDataNode[] => {
    return data.map(({render, children, ...node}) => ({
      ...node,
      title: render,
      render: render,
      children: children ? transformTreeData(children) : [],
    }));
  };

  return (
    <Flex gap={8} vertical>
      <Search
        placeholder="Найти знание"
        onChange={onChange}
        enterButton={<SearchOutlined/>}
      />
      <Tree
        treeData={transformTreeData(processedTreeData)}
        selectable={selectMode}
        selectedKeys={selectedKnowledge === undefined ? undefined : selectedKeys}
        onSelect={(keys) => {
          setSelectedKeys(keys);
          if (keys) {
            setSelectedKnowledge(knowledgeList?.find((k) => k.id === keys[0]?.toString()));
            console.log(treeData, keys);
          }
        }}
        onDrop={onDrop}
        draggable={true}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
        defaultExpandAll={true}
        height={600}
      />
      {createNodeVisible &&
          <CreateKnowledgeNode
              onCreate={(name, description) => handleAddNode(name, description)}
              onCancel={() => setCreateNodeVisible(false)}/>
      }
      <Button
        type="primary"
        icon={<PlusOutlined/>}
        onClick={() => setCreateNodeVisible(true)}
      >
        Добавить знание
      </Button>
    </Flex>
  );
};

export default KnowledgeTree;
