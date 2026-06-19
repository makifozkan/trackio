import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle"
import { FunctionComponent, JSX } from "react";
import { Editor } from "@tiptap/react";
import { Heading1, Heading2, Heading3, Bold, Italic, Strikethrough, Highlighter, Code, TextAlignStart, TextAlignCenter, TextAlignEnd, TextAlignJustify } from 'lucide-react';

interface MenuBarProps {
    editor: Editor;
}


const MenuBar: FunctionComponent<MenuBarProps> = ({ editor }) => {
    if (!editor) {
        return null
    }

    const MenuItemsList = [
        {
            icon: <Heading1 />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: editor.isActive('heading', { level: 1 })
        },
        {
            icon: <Heading2 />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor.isActive('heading', { level: 2 })
        },
        {
            icon: <Heading3 />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor.isActive('heading', { level: 3 })
        },
        {
            icon: <Bold />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive('bold')
        },
        {
            icon: <Italic />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editor.isActive('italic')
        },
        {
            icon: <Strikethrough />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editor.isActive('strike')
        },
        {
            icon: <Highlighter />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            pressed: editor.isActive('highlight')
        },
        {
            icon: <Code />,
            onClick: () => editor.chain().focus().toggleCode().run(),
            pressed: editor.isActive('code')
        },
        {
            icon: <TextAlignStart />,
            onClick: () => editor.chain().focus().setTextAlign('left').run(),
            pressed: editor.isActive({ textAlign: 'left' })
        },
        {
            icon: <TextAlignCenter />,
            onClick: () => editor.chain().focus().setTextAlign('center').run(),
            pressed: editor.isActive({ textAlign: 'center' })
        },
        {
            icon: <TextAlignEnd />,
            onClick: () => editor.chain().focus().setTextAlign('right').run(),
            pressed: editor.isActive({ textAlign: 'right' })
        },
        {
            icon: <TextAlignJustify />,
            onClick: () => editor.chain().focus().setTextAlign('justify').run(),
            pressed: editor.isActive({ textAlign: 'justify' })
        }
    ];

    return (
        <>
            {MenuItemsList.map((menuItem, index) => (
                <Toggle key={index} pressed={menuItem.pressed} className="m-1" onClick={menuItem.onClick}>
                    {menuItem.icon}
                </Toggle>
            ))}
        </>);
}

export default MenuBar;