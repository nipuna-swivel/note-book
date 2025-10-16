import React from "react";
import { FileText, Trash2 } from "lucide-react";

function PageItem({ page, noteId, handleDeletePage, setSelectedPage }:any) {
  return (
    <div
      onClick={() => setSelectedPage(page)}
      className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <FileText size={14} />
        <span className="text-sm truncate">{page.title}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeletePage(noteId, page.id);
        }}
        className="text-gray-400 hover:text-red-500"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default PageItem;
