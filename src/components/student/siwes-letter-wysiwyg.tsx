'use client';

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  RotateCcw,
  Heading2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface SiwesLetterWysiwygProps {
  initialHtml: string;
  onChange: (html: string) => void;
  onReset: () => void;
  studentName?: string;
  isLoading?: boolean;
}

export function SiwesLetterWysiwyg({
  initialHtml,
  onChange,
  onReset,
  studentName,
  isLoading = false,
}: SiwesLetterWysiwygProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync initialHtml only on load or reset
  useEffect(() => {
    if (editorRef.current && initialHtml) {
      if (editorRef.current.innerHTML !== initialHtml) {
        editorRef.current.innerHTML = initialHtml;
      }
    }
  }, [initialHtml]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertDate = () => {
    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    execCommand('insertHTML', `<strong>Date:</strong> ${today}`);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
      {/* ── Compact WYSIWYG Formatting Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 border-b border-slate-100 bg-slate-50/90 text-slate-700">
        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
          {/* Text Style */}
          <button
            type="button"
            onClick={() => execCommand('bold')}
            title="Bold (Ctrl+B)"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            title="Italic (Ctrl+I)"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            title="Underline (Ctrl+U)"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-0.5" />

          {/* Heading & Paragraph */}
          <button
            type="button"
            onClick={() => execCommand('formatBlock', '<h2>')}
            title="Heading"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', '<p>')}
            title="Paragraph"
            className="min-h-[44px] min-w-[44px] px-1.5 py-0.5 text-[11px] font-semibold rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            Body
          </button>

          <span className="w-px h-4 bg-slate-200 mx-0.5" />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => execCommand('justifyLeft')}
            title="Align Left"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyCenter')}
            title="Align Center"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyFull')}
            title="Justify"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-0.5" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
            className="min-h-[44px] min-w-[44px] p-1.5 rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-200 mx-0.5" />

          {/* Quick Date Insert */}
          <button
            type="button"
            onClick={insertDate}
            title="Insert Today's Date"
            className="min-h-[44px] inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-lg hover:bg-white hover:shadow-2xs text-slate-700 active:bg-slate-200 transition-all cursor-pointer"
          >
            <Calendar className="w-3 h-3 text-slate-400" /> Date
          </button>
        </div>

        {/* Reset Template */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-[11px] text-slate-500 hover:text-slate-900 rounded-full h-7 px-2.5 gap-1 cursor-pointer ml-auto"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>
      </div>

      {/* ── Clean Document Paper Canvas ── */}
      <div className="flex-1 bg-slate-100/50 p-3 sm:p-5 overflow-y-auto min-h-[460px] flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-xs border border-slate-200/90 p-5 sm:p-7 text-slate-900 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center rounded-xl z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-indigo">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Formatting document...
              </div>
            </div>
          )}

          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            suppressContentEditableWarning
            className="outline-none min-h-[380px] font-serif text-xs sm:text-sm leading-relaxed space-y-3 focus:ring-0 prose prose-slate max-w-none [&_h2]:font-sans [&_h2]:text-xs [&_h2]:font-bold [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
          />
        </div>
      </div>
    </div>
  );
}
