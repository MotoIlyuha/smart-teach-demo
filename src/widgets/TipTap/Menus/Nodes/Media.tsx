import {useState} from 'react';
import {Button, Popover, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {EditorContentProps} from '@tiptap/react';

export default function Media({editor}: {editor: EditorContentProps['editor']}) {
  const [open, setOpen] = useState(false);
  if (!editor) return null;

  const props: UploadProps = {
    showUploadList: false,
    beforeUpload: file => {
      const reader = new FileReader();
      reader.onload = e => {
        const src = e.target?.result as string;
        if (!src) return;
        let tag = 'img';
        if (file.type.startsWith('audio')) tag = 'audio';
        if (file.type.startsWith('video')) tag = 'video';
        const html = tag === 'img'
          ? `<img src="${src}" alt="${file.name}" />`
          : `<${tag} controls src="${src}"></${tag}>`;
        editor.chain().focus().insertContent(html).run();
      };
      reader.readAsDataURL(file);
      setOpen(false);
      return false;
    },
  };

  const content = <Upload {...props}><Button icon={<UploadOutlined/>}>Загрузить</Button></Upload>;

  return (
    <Popover title='Медиа' content={content} open={open} onOpenChange={setOpen} trigger='click'>
      <Button icon={<UploadOutlined/>}/>
    </Popover>
  );
}
