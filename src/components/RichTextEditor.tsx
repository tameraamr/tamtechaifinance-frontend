"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: 2000,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none text-white min-h-[120px] p-3',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-700 bg-gray-900">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('bold') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'
          }`}
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('italic') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'
          }`}
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-600 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('bulletList') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'
          }`}
          type="button"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('orderedList') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'
          }`}
          type="button"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive('blockquote') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'
          }`}
          type="button"
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-600 mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400"
          type="button"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400"
          type="button"
        >
          <Redo className="w-4 h-4" />
        </button>
        <div className="ml-auto text-xs text-gray-500">
          {editor.storage.characterCount.characters()}/2000
        </div>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none focus:outline-none text-white min-h-[120px]"
      />

      {/* Custom styles for the editor */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          color: white;
        }
        .ProseMirror p {
          margin: 0 0 1em 0;
          color: white;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          color: white;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #f59e0b;
          padding-left: 1em;
          margin: 1em 0;
          color: #d1d5db;
        }
        .ProseMirror strong {
          font-weight: 600;
          color: white;
        }
        .ProseMirror em {
          font-style: italic;
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
}