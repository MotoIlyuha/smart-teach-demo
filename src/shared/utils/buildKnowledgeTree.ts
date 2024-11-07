import {Knowledge} from "../types/CourseTypes.ts";
import {TreeDataNode} from "antd";

interface TreeDataNodeWithParentId extends TreeDataNode {
  key: string;
  value: string;
  title: string;
  description?: string | null;
  parentId?: string | null;
  children?: TreeDataNodeWithParentId[];
}

// Функция для преобразования дерева знаний в формат TreeData
export const convertToTreeData = (knowledgeTree: Knowledge[], parentId: string | null = null): TreeDataNodeWithParentId[] => {
  return knowledgeTree.map((node) => ({
    key: node.id,
    value: node.id,
    title: node.name,
    description: node.description,
    children: node.children ? convertToTreeData(node.children) : [],
    parentId: parentId,
  }));
};

// Рекурсивная функция для построения дерева знаний
export const buildTree = (knowledgeList: Knowledge[], parentId: string | null = null): Knowledge[] => {
  if (!knowledgeList) return [];
  return knowledgeList
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: buildTree(knowledgeList, item.id), // Рекурсивно находим дочерние элементы
    }));
};