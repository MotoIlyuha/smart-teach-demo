import {pasteEmptyQuestion} from "../handlers/PasteEmptyQuestion.ts";
import {ChoiceType} from "../../../../shared/types/CourseTypes.ts";
import {Button, Dropdown} from "antd";
import {CheckCircleOutlined, CheckSquareOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {RiInputField} from "react-icons/ri";
import {MdOutlineTextFields} from "react-icons/md";
import {AiOutlineFieldBinary} from "react-icons/ai";
import {HiSelector} from "react-icons/hi";
import {PiTextAlignJustifyThin} from "react-icons/pi";
import {BiTransfer} from "react-icons/bi";
import {EditorContentProps} from "@tiptap/react";

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
  },
  {
    label: 'Порядок',
    icon: <BiTransfer />,
    disabled: true,
    key: 'order',
  }
]

const PasteQuestion = ({editor}: {editor: EditorContentProps['editor']}) => (
  <Dropdown
    menu={{
      items: menu_items,
      onClick: (({key}) => {
        editor?.chain().focus().insertContent(pasteEmptyQuestion(key as ChoiceType)).run();
      })
    }}
  >
    <Button title={'Вставить вопрос'}>? вопрос</Button>
  </Dropdown>
)

export default PasteQuestion;