import {Button, Divider, Space, Menu} from "antd";
import {
  BoldOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CodeOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import {RiInputField} from "react-icons/ri";
import {PiTextAlignJustifyThin} from "react-icons/pi";
import {MdOutlineTextFields} from "react-icons/md";
import {AiOutlineFieldBinary} from "react-icons/ai";
import {HiSelector} from "react-icons/hi";
import {EditorContentProps} from "@tiptap/react";
import Link from "./Marks/Link";
import Image from "./Nodes/Image";
import Formula from "./Nodes/Formula";
import {ChoiceType, QuestionType} from "../../../shared/types/CourseTypes";


export default function ToolBox({editor}: { editor: EditorContentProps['editor'] }) {

  if (!editor) {
    return null
  }

  const welcomeText = (type: ChoiceType) => {
    if (type === 'mono') {
      return "Выберите один из вариантов ответа:"
    } else {
      return "Выберите несколько вариантов ответа:"
    }
  }

  const pasteEmptyQuestion = (type: QuestionType) => JSON.parse(
    `{
            "type": "reactComponent",
            "attrs": {
                "content": {
                    "id": "${Date.now()}",
                    "type": "${type}",
                    "cost": 1,
                    "invitationText": "${welcomeText(type as ChoiceType)}",
                    "requiredKnowledge": [],
                    "options": [
                        {
                            "id": "Вариант 1",
                            "text": "1"
                        },
                        {
                            "id": "Вариант 2",
                            "text": "2"
                        }
                    ],
                    "correctAnswerIds": [
                        "1"
                    ],
                    "shuffleOptions": true
                },
                "meta": {
                    "edit": true
                }
            }
        }`)

  const menu_items = [
    {
      key: 'question',
      label: 'С вариантами ответов',
      icon: <UnorderedListOutlined/>,
      children: [
        {
          label: 'с одним правильным',
          icon: <CheckCircleOutlined/>,
          key: 'mono'
        },
        {
          label: 'с несколькими правильными',
          icon: <CheckSquareOutlined/>,
          key: 'multi'
        }
      ]
    },
    {
      key: 'input',
      label: 'Ввод текста',
      icon: <RiInputField/>,
      children: [
        {
          label: 'ввод текста',
          icon: <MdOutlineTextFields/>,
          key: 'text'
        },
        {
          label: 'ввод числа',
          icon: <AiOutlineFieldBinary/>,
          key: 'number'
        },
        {
          label: 'выбор из списка',
          icon: <HiSelector/>,
          key: 'select'
        },
        {
          label: 'ввод многострочного текста',
          icon: <PiTextAlignJustifyThin/>,
          key: 'textarea'
        }
      ]
    }
  ]

  return (
    <Space split={<Divider/>} style={{margin: '10px'}}>
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
      <Space.Compact direction={'vertical'}>
        {/*<Typography.Text>Вставить вопрос</Typography.Text>*/}
        <Menu
          items={menu_items}
          onClick={({key}) => {
            editor?.chain().focus().insertContent(pasteEmptyQuestion(key as ChoiceType)).run()
          }}
          selectable={false}
          selectedKeys={[]}
          mode={'horizontal'}
        />
      </Space.Compact>
    </Space>
  )
}
