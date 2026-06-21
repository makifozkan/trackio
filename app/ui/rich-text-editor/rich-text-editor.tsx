'use client';

import './styles.scss';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import MenuBar from './menu-bar';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Code from '@tiptap/extension-code';

export default function RichTextEditor({ onChange }: { onChange: (text: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Code.configure({
        HTMLAttributes: {
          class: 'my-custom-class',
        },
      }),
    ],
    content: `${new Array(40)
      .fill(0)
      .map((i) => '<p></p>')
      .join('')}`,
  });

  return (
    <>
      <div className="bg-white rounded-sm my-4 p-2 shadow-md">
        <MenuBar editor={editor} />
      </div>

      <div className="flex-1 bg-white rounded-sm shadow-md h-full overflow-y-auto scrollbar-none">
        <EditorContent
          onChange={() => onChange(editor.getHTML())}
          className="h-full"
          editor={editor}
        />
      </div>
    </>
  );
}
