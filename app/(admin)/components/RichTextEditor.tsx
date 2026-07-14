'use client'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState } from 'react'
import { adminUpload } from '@/lib/admin-upload'

function Btn({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`min-w-8 h-8 px-2 rounded-md text-sm flex items-center justify-center transition-colors ${
        active ? 'bg-[#C1121F] text-white' : 'text-slate-600 hover:bg-slate-100'
      } disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

function Toolbar({
  editor,
  uploadError,
  onUploadError,
}: {
  editor: Editor
  uploadError: string
  onUploadError: (msg: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setUploading(true)
    onUploadError('')
    try {
      const { url } = await adminUpload(f)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err) {
      onUploadError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function addLink() {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Enter URL', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const divider = <span className="w-px h-5 bg-slate-300 mx-1" />

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 sticky top-0 z-10 rounded-t-lg">
        <Btn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}><b>B</b></Btn>
        <Btn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}><i>I</i></Btn>
        <Btn title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}><u>U</u></Btn>
        <Btn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}><s>S</s></Btn>
        {divider}
        <Btn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</Btn>
        <Btn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>H3</Btn>
        <Btn title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')}>¶</Btn>
        {divider}
        <Btn title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>•</Btn>
        <Btn title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>1.</Btn>
        <Btn title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>&ldquo;</Btn>
        <Btn title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>{'</>'}</Btn>
        {divider}
        <Btn title="Link" onClick={addLink} active={editor.isActive('link')}>🔗</Btn>
        <Btn title="Insert image" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? '…' : '🖼'}</Btn>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickImage} />
        {divider}
        <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>↶</Btn>
        <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>↷</Btn>
      </div>
      {uploadError && <p className="px-3 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">{uploadError}</p>}
    </>
  )
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value?: string
  onChange: (html: string) => void
}) {
  const [uploadError, setUploadError] = useState('')
  const htmlValue = typeof value === 'string' ? value : ''

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Write your blog post…' }),
    ],
    content: htmlValue,
    editorProps: {
      attributes: {
        class: 'admin-prose focus:outline-none min-h-[360px] px-4 py-3',
      },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (htmlValue !== current) {
      editor.commands.setContent(htmlValue || '', { emitUpdate: false })
    }
  }, [editor, htmlValue])

  if (!editor) return <div className="bg-slate-100 border border-slate-200 rounded-lg h-40 animate-pulse" />

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
      <Toolbar editor={editor} uploadError={uploadError} onUploadError={setUploadError} />
      <EditorContent editor={editor} />
    </div>
  )
}
