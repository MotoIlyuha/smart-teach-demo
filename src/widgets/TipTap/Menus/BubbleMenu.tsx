import {ReactNode, CSSProperties} from "react";
import {BubbleMenu, EditorContentProps} from "@tiptap/react";
import {Space, Button, Tooltip} from "antd";
import {BoldOutlined, EditOutlined, ItalicOutlined, DeleteOutlined} from "@ant-design/icons";

interface ButtonGroup {
  title: string
  onClick: () => void
  icon: ReactNode
  disabled?: boolean
  danger?: boolean
  type?: 'default' | 'primary'
  style?: CSSProperties
}

export default function BubbleMenuEditor({editor}: { editor: EditorContentProps['editor'] }) {

  if (!editor) {
    return null
  }

  function deleteReactComponentWithId(id: string) {
    if (!editor) return;
    const {state, view} = editor;

    state.doc.descendants((node, pos) => {
      if (node.type.name === 'reactComponent' && node.attrs?.content?.id === id) {
        const tr = state.tr;
        tr.delete(pos, pos + node.nodeSize);
        view.dispatch(tr);
        return false;
      }
    });
  }

  function editReactComponentWithId(id: string) {
    if (!editor) return;
    const {state, view} = editor;

    state.doc.descendants((node, pos) => {
      if (node.type.name === 'reactComponent' && node.attrs?.content?.id === id) {
        const tr = state.tr;
        tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            edit: true
          }
        );
        view.dispatch(tr);
        return false;
      }
    });
  }

  const rcBMItems = (content: { type: string, id: string }): ButtonGroup[] => [
    {
      icon: <EditOutlined/>,
      onClick: () => editReactComponentWithId(content.id),
      type: 'default',
      title: 'Редактировать',

    },
    {
      icon: <DeleteOutlined/>,
      onClick: () => deleteReactComponentWithId(content.id),
      title: 'Удалить',
      type: 'default',
      danger: true,
      style: {color: 'red'},
    },
  ]

  return (
    <>
      {editor && <BubbleMenu className="bubble-menu" tippyOptions={{duration: 100}} editor={editor}>
        {editor.getAttributes('reactComponent')?.content?.id ? (
          <Space.Compact style={{display: editor.getAttributes('reactComponent')?.edit ? 'none' : 'flex'}}>
            {rcBMItems(editor.getAttributes('reactComponent')?.content).map((item) => (
              <Tooltip title={item.title} key={item.title}>
                <Button
                  key={item.title}
                  icon={item.icon}
                  onClick={item.onClick}
                  type={item.type}
                  danger={item.danger}
                  style={item.style}
                />
              </Tooltip>
            ))}
          </Space.Compact>
        ) : (
          <Space.Compact>
            {[
              {
                icon: <BoldOutlined/>,
                onClick: () => editor?.chain().focus().toggleBold().run(),
                disabled: !editor?.can().chain().focus().toggleBold().run(),
                type: editor.isActive('bold') ? 'primary' : 'default',
                title: 'Жирный',
              },
              {
                icon: <ItalicOutlined/>,
                onClick: () => editor?.chain().focus().toggleItalic().run(),
                disabled: !editor?.can().chain().focus().toggleItalic().run(),
                type: editor.isActive('italic') ? 'primary' : 'default',
                title: 'Курсив',
              },
            ].map((item) => (
              <Tooltip title={item.title}>
                <Button
                  icon={item.icon}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  type={item.type as 'primary' | 'default'}
                />
              </Tooltip>
            ))}
          </Space.Compact>
        )}
      </BubbleMenu>}
    </>
  )
}