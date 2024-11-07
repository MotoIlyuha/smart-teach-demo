import {Button, Divider, Space} from "antd";
import {
  BoldOutlined,
  CodeOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import {EditorContentProps} from "@tiptap/react";
import Link from "./Marks/Link";
import Image from "./Nodes/Image";
import Formula from "./Nodes/Formula";
import PasteQuestion from "./Nodes/Question.tsx";


export default function ToolBox({editor}: { editor: EditorContentProps['editor'] }) {

  if (!editor) return null;

  return (
    <Space split={<Divider/>} wrap>
      <Space.Compact>
        <Button icon={<BoldOutlined/>}
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                type={editor.isActive('bold') ? 'primary' : 'default'}/>
        <Button icon={<ItalicOutlined/>}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                type={editor.isActive('italic') ? 'primary' : 'default'}/>
        <Button icon={<StrikethroughOutlined/>}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                type={editor.isActive('strike') ? 'primary' : 'default'}/>
        <Button icon={<CodeOutlined/>}
                onClick={() => editor?.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                type={editor.isActive('code') ? 'primary' : 'default'}/>
      </Space.Compact>
      <Space.Compact>
        <Button icon={<UnorderedListOutlined/>}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
                type={editor.isActive('bulletList') ? 'primary' : 'default'}/>
        <Button icon={<OrderedListOutlined/>}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                type={editor.isActive('orderedList') ? 'primary' : 'default'}/>
      </Space.Compact>
      <Space.Compact>
        <Link editor={editor}/>
        <Formula editor={editor}/>
        <Image editor={editor}/>
      </Space.Compact>
      <Space.Compact direction={'horizontal'}>
        <PasteQuestion editor={editor}/>
      </Space.Compact>
    </Space>
  )
}
