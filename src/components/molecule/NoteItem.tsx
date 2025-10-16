import React from "react";
import { Plus, Trash2 } from "lucide-react";
import PageItem from "./PageItem";

function NoteItem({
  note,
  isExpanded,
  toggleExpandNote,
  handleAddPage,
  handleDeleteNote,
  handleDeletePage,
  setSelectedNote,
  setSelectedPage,
}:any) {
  return (
    <div>
      {/* Note Header */}
      <div
        onClick={() => {
          toggleExpandNote(note.id);
          setSelectedNote(note);
        }}
        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
      >
        <span className="font-medium truncate">{note.title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddPage(note.id);
            }}
            className="text-gray-500 hover:text-blue-600"
            title="Add page"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNote(note.id);
            }}
            className="text-gray-500 hover:text-red-600"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Pages list */}
      {isExpanded && (
        <div className="ml-4 space-y-1 border-l pl-3">
          {note.pages.map((page) => (
            <PageItem
              key={page.id}
              page={page}
              noteId={note.id}
              handleDeletePage={handleDeletePage}
              setSelectedPage={setSelectedPage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteItem;
