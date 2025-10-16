"use client";
import React from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";

interface Page {
  id: number;
  title: string;
}

interface Note {
  id: number;
  title: string;
  pages: Page[];
}

// Only the props that NoteHeader needs
interface NoteHeaderProps {
  note: Note;
  isExpanded: boolean;
  toggleExpandNote: (noteId: number) => void;
  handleDeleteNote: (noteId: number) => void;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({
  note,
  isExpanded,
  toggleExpandNote,
  handleDeleteNote,
}) => {
  return (
    <div
      className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer hover:bg-gray-200 transition"
      onClick={() => toggleExpandNote(note.id)}
    >
      <div className="flex items-center gap-2">
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <span className="font-medium">{note.title}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteNote(note.id);
        }}
        className="text-red-500 hover:text-red-700 transition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default NoteHeader;
