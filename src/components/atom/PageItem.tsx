"use client";
import React from "react";
import { Trash2, FileText } from "lucide-react";
import { PageItemProps } from "@/types/Note";

const PageItem: React.FC<PageItemProps> = ({
  page,
  note,
  setSelectedNote,
  setSelectedPage,
  handleDeletePage,
}) => {
  return (
    <div className="flex justify-between items-center group cursor-pointer rounded-md px-2 py-1 hover:bg-gray-50 transition">
      <div
        onClick={() => {
          setSelectedNote(note);
          setSelectedPage(page);
        }}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full"
      >
        <FileText size={16} />
        <span>{page.title}</span>
      </div>

      {/* Delete Page Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeletePage({
            noteId: Number(note.id),
            pageId: Number(page.id),
          });
        }}
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
};

export default PageItem;
