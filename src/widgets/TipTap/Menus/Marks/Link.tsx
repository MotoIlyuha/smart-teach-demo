import {Button, Popover, Space} from "antd";
import {Input} from "@ant-design/pro-editor";
import {LinkOutlined} from "@ant-design/icons";
import {useCallback, useEffect, useState} from "react";
import {EditorContentProps} from "@tiptap/react";

export default function Link({editor}: { editor: EditorContentProps['editor'] }) {
    const [open, setOpen] = useState(false);
    const [pastedLink, setPastedLink] = useState('');

    useEffect(() => {
        if (editor) {
            setPastedLink(editor.getAttributes('link').href || '');
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const url = pastedLink;

        if (!url || !editor) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({href: url}).run();
        }

        setOpen(false);
    }, [editor, pastedLink]);

    const content = () => {
        return (
            <Space.Compact>
                <Input placeholder="Вставьте ссылку" value={pastedLink}
                       onChange={setPastedLink}
                       onPressEnter={setLink}/>
                <Button type="primary" onClick={setLink}>Вставить</Button>
            </Space.Compact>
        );
    };

    return (
        <Popover
            title="Вставить ссылку"
            content={content}
            open={open}
            onOpenChange={setOpen}
            trigger="click"
        >
            <Button icon={<LinkOutlined/>}/>
        </Popover>
    );
}
