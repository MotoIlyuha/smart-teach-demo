import {useState} from "react";
import {RiFormula} from "react-icons/ri";
import {Button, Popover, Tooltip, Flex, Input} from "antd";
import {EditorContentProps} from "@tiptap/react";
import {addStyles, EditableMathField} from "react-mathquill";
import katex from 'katex';

addStyles();

export default function Formula({editor}: { editor: EditorContentProps['editor'] }) {

    const [open, setOpen] = useState(false);

    const Content = () => {
        const [latex, setLatex] = useState("\\frac{1}{\\sqrt{2}}\\cdot 2");

        const handlePasteFormula = () => {
            if (editor) {
                editor.chain().focus().insertContent(`$${latex}$ `).run();
            }
            setOpen(false);
        }

        const isValidLatex = (latexString: string): boolean => {
            try {
                katex.renderToString(latexString);
                return true;
            } catch {
                return false;
            }
        };

        return (
            <Flex gap={4} vertical>
                <EditableMathField
                    latex={latex}
                    onChange={(mathField) => {
                        setLatex(mathField.latex());
                    }}

                />
                <Input placeholder="Вставьте формулу" prefix={'LaTeX:'} value={latex}
                       onChange={(e) => setLatex(e.target.value)} status={isValidLatex(latex) ? '' : 'warning'}/>
                <Button
                    type={isValidLatex(latex) ? 'primary' : 'default'}
                    onClick={handlePasteFormula}
                    size={'small'}
                    style={{marginLeft: 'auto', width: '50%'}}
                >
                    Вставить
                </Button>
            </Flex>
        )
    }

    return (
        <Tooltip title="Формула">
            <Popover
                title='Вставить формулу'
                content={<Content/>}
                open={open}
                onOpenChange={setOpen}
                trigger='click'
            >
                <Button icon={<RiFormula/>}/>
            </Popover>
        </Tooltip>
    );
}