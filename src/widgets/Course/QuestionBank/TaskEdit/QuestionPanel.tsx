import {Flex, Button} from 'antd';
import {CheckCircleOutlined, CheckSquareOutlined} from 'react-icons/all';
import {MdOutlineTextFields} from 'react-icons/md';
import {AiOutlineFieldBinary} from 'react-icons/ai';
import {HiSelector} from 'react-icons/hi';
import {PiTextAlignJustifyThin} from 'react-icons/pi';
import {BiTransfer} from 'react-icons/bi';
import {EditorContentProps} from '@tiptap/react';
import {pasteEmptyQuestion} from '../../../TipTap/Menus/handlers/PasteEmptyQuestion';
import {ChoiceType} from '../../../../shared/types/CourseTypes';

export default function QuestionPanel({editor}: {editor: EditorContentProps['editor']}) {
  if (!editor) return null;
  const insert = (key: ChoiceType) => {
    editor.chain().focus().insertContent(pasteEmptyQuestion(key)).run();
  };
  return (
    <Flex vertical gap={8} style={{padding: 8}}>
      <Button onClick={() => insert('mono')} icon={<CheckCircleOutlined/>}>Один ответ</Button>
      <Button onClick={() => insert('multi')} icon={<CheckSquareOutlined/>}>Несколько ответов</Button>
      <Button onClick={() => insert('text')} icon={<MdOutlineTextFields/>}>Короткий текст</Button>
      <Button onClick={() => insert('number')} icon={<AiOutlineFieldBinary/>}>Число</Button>
      <Button onClick={() => insert('select')} icon={<HiSelector/>}>Выбор из списка</Button>
      <Button onClick={() => insert('textarea')} icon={<PiTextAlignJustifyThin/>}>Длинный текст</Button>
      <Button disabled icon={<BiTransfer/>}>Порядок элементов</Button>
    </Flex>
  );
}
