"use client"

import { useEffect, useRef } from "react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const isUpdatingRef = useRef(false)

    useEffect(() => {
        if (editorRef.current && !isUpdatingRef.current) {
            editorRef.current.innerHTML = value
        }
    }, [value])

    const handleInput = () => {
        if (editorRef.current) {
            isUpdatingRef.current = true
            onChange(editorRef.current.innerHTML)
            setTimeout(() => {
                isUpdatingRef.current = false
            }, 0)
        }
    }

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
    }

    const addHeading = (level: number) => {
        execCommand("formatBlock", `<h${level}>`)
    }

    const addLink = () => {
        const url = prompt("Enter URL:")
        if (url) {
            execCommand("createLink", url)
        }
    }

    const insertImage = () => {
        const url = prompt("Enter image URL:")
        if (url) {
            execCommand("insertImage", url)
        }
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
                {/* Text Formatting */}
                <button
                    type="button"
                    onClick={() => execCommand("bold")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("italic")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Italic"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("underline")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Underline"
                >
                    <u>U</u>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("strikeThrough")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Strikethrough"
                >
                    <s>S</s>
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Headings */}
                <button
                    type="button"
                    onClick={() => addHeading(1)}
                    className="px-3 py-2 hover:bg-gray-200 rounded text-sm font-bold"
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => addHeading(2)}
                    className="px-3 py-2 hover:bg-gray-200 rounded text-sm font-bold"
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => addHeading(3)}
                    className="px-3 py-2 hover:bg-gray-200 rounded text-sm font-bold"
                    title="Heading 3"
                >
                    H3
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Lists */}
                <button
                    type="button"
                    onClick={() => execCommand("insertUnorderedList")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Bullet List"
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("insertOrderedList")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Numbered List"
                >
                    1. List
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Alignment */}
                <button
                    type="button"
                    onClick={() => execCommand("justifyLeft")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Align Left"
                >
                    ←
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("justifyCenter")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Align Center"
                >
                    ↔
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("justifyRight")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Align Right"
                >
                    →
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Links & Images */}
                <button
                    type="button"
                    onClick={addLink}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Insert Link"
                >
                    🔗
                </button>
                <button
                    type="button"
                    onClick={insertImage}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Insert Image"
                >
                    🖼️
                </button>

                <div className="w-px bg-gray-300 mx-1" />

                {/* Undo/Redo */}
                <button
                    type="button"
                    onClick={() => execCommand("undo")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Undo"
                >
                    ↶
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("redo")}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Redo"
                >
                    ↷
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
                style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                }}
                data-placeholder={placeholder}
            />

            <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          pointer-events: none;
        }
      `}</style>
        </div>
    )
}