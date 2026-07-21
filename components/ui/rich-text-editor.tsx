"use client";

import { EditorContent, useEditor, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  initialContent: JSONContent;
  onChange: (json: JSONContent) => void;
  ariaLabel: string;
  placeholder?: string;
  minHeightClassName?: string;
}

/**
 * Uncontrolled by design: pass a `key` from the caller (e.g. the note's id) to
 * remount when switching documents. `initialContent` only seeds the editor at
 * mount — it's not re-synced on every render, so switching notes needs a new key.
 */
export function RichTextEditor({
  initialContent,
  onChange,
  ariaLabel,
  placeholder,
  minHeightClassName = "min-h-[300px]",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        "aria-label": ariaLabel,
        class: cn(
          "tiptap w-full resize-y text-sm leading-[1.75] text-[var(--text)] outline-none",
          minHeightClassName
        ),
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2">
      <Toolbar editor={editor} />
      <div className="rounded-lg focus-within:ring-2 focus-within:ring-[var(--brand)]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const items: { label: string; title: string; isActive: () => boolean; run: () => void }[] = [
    { label: "B", title: "Bold", isActive: () => editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "I", title: "Italic", isActive: () => editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    { label: "S", title: "Strikethrough", isActive: () => editor.isActive("strike"), run: () => editor.chain().focus().toggleStrike().run() },
    { label: "H2", title: "Heading", isActive: () => editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "H3", title: "Subheading", isActive: () => editor.isActive("heading", { level: 3 }), run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "• List", title: "Bullet list", isActive: () => editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "1. List", title: "Numbered list", isActive: () => editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "❝❞", title: "Quote", isActive: () => editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "</>", title: "Code block", isActive: () => editor.isActive("codeBlock"), run: () => editor.chain().focus().toggleCodeBlock().run() },
  ];

  return (
    <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Formatting">
      {items.map((item) => (
        <button
          key={item.title}
          type="button"
          title={item.title}
          aria-label={item.title}
          aria-pressed={item.isActive()}
          onClick={item.run}
          className={cn(
            "rounded-md border border-[var(--border)] px-2 py-1 text-[11px] font-semibold text-[var(--text)]",
            item.isActive() && "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
