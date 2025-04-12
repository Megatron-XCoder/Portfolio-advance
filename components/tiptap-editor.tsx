"use client"

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { lowlight } from 'lowlight/lib/core'


import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import json from "highlight.js/lib/languages/json"

// 🔥 register the languages
lowlight.registerLanguage("javascript", javascript)
lowlight.registerLanguage("typescript", typescript)
lowlight.registerLanguage("json", json)

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"

import { useState, useEffect } from "react"
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TipTapEditor({ value, onChange, placeholder = "Write your content here..." }: TipTapEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // we disable the default codeBlock
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full h-auto my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
            "prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 prose-headings:text-primary prose-a:text-primary",
        placeholder,
      },
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  const addLink = () => {
    if (!linkUrl) return

    editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()

    setLinkUrl("")
    setShowLinkInput(false)
  }

  const addImage = () => {
    if (!imageUrl) return

    editor?.chain().focus().setImage({ src: imageUrl }).run()

    setImageUrl("")
    setShowImageInput(false)
  }

  if (!isMounted) {
    return (
        <div className="border border-border rounded-md bg-background min-h-[300px] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
        </div>
    )
  }

  if (!editor) {
    return null
  }

  return (
      <div className="border border-border rounded-md bg-background overflow-hidden">
        <div className="bg-secondary p-2 flex flex-wrap gap-1 border-b border-border">
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-primary/20" : ""}
              type="button"
          >
            <Bold size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-primary/20" : ""}
              type="button"
          >
            <Italic size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-primary/20" : ""}
              type="button"
          >
            <UnderlineIcon size={16} />
          </Button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "bg-primary/20" : ""}
              type="button"
          >
            <Heading1 size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-primary/20" : ""}
              type="button"
          >
            <Heading2 size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive("heading", { level: 3 }) ? "bg-primary/20" : ""}
              type="button"
          >
            <Heading3 size={16} />
          </Button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-primary/20" : ""}
              type="button"
          >
            <List size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-primary/20" : ""}
              type="button"
          >
            <ListOrdered size={16} />
          </Button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={editor.isActive({ textAlign: "left" }) ? "bg-primary/20" : ""}
              type="button"
          >
            <AlignLeft size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={editor.isActive({ textAlign: "center" }) ? "bg-primary/20" : ""}
              type="button"
          >
            <AlignCenter size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={editor.isActive({ textAlign: "right" }) ? "bg-primary/20" : ""}
              type="button"
          >
            <AlignRight size={16} />
          </Button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={editor.isActive("link") ? "bg-primary/20" : ""}
              type="button"
          >
            <LinkIcon size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowImageInput(!showImageInput)} type="button">
            <ImageIcon size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "bg-primary/20" : ""}
              type="button"
          >
            <Code size={16} />
          </Button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              type="button"
          >
            <Undo size={16} />
          </Button>
          <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              type="button"
          >
            <Redo size={16} />
          </Button>
        </div>

        {showLinkInput && (
            <div className="p-2 bg-secondary border-b border-border flex gap-2">
              <Input
                  type="url"
                  placeholder="Enter URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="bg-background border-border"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addLink()
                    }
                  }}
              />
              <Button onClick={addLink} type="button">
                Add Link
              </Button>
              <Button variant="outline" onClick={() => setShowLinkInput(false)} type="button">
                Cancel
              </Button>
            </div>
        )}

        {showImageInput && (
            <div className="p-2 bg-secondary border-b border-border flex gap-2">
              <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-background border-border"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addImage()
                    }
                  }}
              />
              <Button onClick={addImage} type="button">
                Add Image
              </Button>
              <Button variant="outline" onClick={() => setShowImageInput(false)} type="button">
                Cancel
              </Button>
            </div>
        )}

        <EditorContent editor={editor} className="min-h-[300px]" />
      </div>
  )
}
