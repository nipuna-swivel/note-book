"use client";
import React from "react";
import { Plus } from "lucide-react";
import PageItem from "../atom/PageItem";
import NoteHeader from "../atom/NoteHeader";
import { NoteItemProps } from "@/types/Note";

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  isExpanded,
  toggleExpandNote,
  handleAddPage,
  handleDeleteNote,
  handleDeletePage,
  setSelectedNote,
  setSelectedPage,
}) => {
  return (
    <div className="border rounded-lg">
      {/* Note Header */}

      <NoteHeader
        note={note}
        isExpanded={isExpanded}
        toggleExpandNote={toggleExpandNote}
        handleDeleteNote={handleDeleteNote}
      />

      {/* Pages List */}
      {isExpanded && (
        <div className="p-3 space-y-2">
          {note.pages.map((page) => (
            <div key={page.id}>
              <PageItem
                note={note}
                page={page}
                handleDeletePage={handleDeletePage}
                setSelectedNote={setSelectedNote}
                setSelectedPage={setSelectedPage}
              />
            </div>
          ))}

          {/* Page Button */}
          <button
            onClick={() => handleAddPage(note.id != null ? Number(note.id) : 0)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-2"
          >
            <Plus size={16} />
            Add Page
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteItem;
