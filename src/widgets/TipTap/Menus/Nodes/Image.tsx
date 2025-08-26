import {Button} from "antd";
import {EditorContentProps} from "@tiptap/react";
import {PictureOutlined} from "@ant-design/icons";

export default function Image({editor}: { editor: EditorContentProps['editor'] }) {
    if (!editor) {
        return null
    }

    return (
        <Button
            icon={<PictureOutlined/>}
        />
    )
}