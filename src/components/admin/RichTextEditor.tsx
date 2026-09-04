"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback } from "react";
import { WPP_T, WPP_FONTS } from "@/lib/wpp/tokens";

export default function RichTextEditor({
  value,
  onChange,
  onUploadImage,
}: {
  value: string;
  onChange: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: "Escribe el contenido del artículo…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: "min-height: 320px; padding: 16px; outline: none; font-size: 15px; line-height: 1.65;",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL del enlace:", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!editor) return;
    if (onUploadImage) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const url = await onUploadImage(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch {
          window.alert("No se ha podido subir la imagen.");
        }
      };
      input.click();
      return;
    }
    const url = window.prompt("URL de la imagen:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor, onUploadImage]);

  if (!editor) return null;

  return (
    <div style={{ border: `1px solid ${WPP_T.hair}`, borderRadius: 8, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          padding: 8,
          background: WPP_T.panel,
          borderBottom: `1px solid ${WPP_T.hair}`,
        }}
      >
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          S
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </ToolbarButton>
        <Divider />
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Lista
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Lista
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          &ldquo; Cita
        </ToolbarButton>
        <Divider />
        <ToolbarButton active={editor.isActive("link")} onClick={setLink}>
          Enlace
        </ToolbarButton>
        <ToolbarButton onClick={insertImage}>Imagen</ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>↺</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>↻</ToolbarButton>
      </div>
      <div style={{ background: "#fff", fontFamily: WPP_FONTS.sans, color: WPP_T.ink }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, background: WPP_T.hair, margin: "2px 4px" }} />;
}

function ToolbarButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        background: active ? WPP_T.ink : "transparent",
        color: active ? "#fff" : WPP_T.ink,
        borderRadius: 6,
        padding: "6px 10px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: WPP_FONTS.sans,
      }}
    >
      {children}
    </button>
  );
}
