"use client";
import React from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { NoteHeaderProps } from "@/types/Note";
import { deleteNotebook } from "@/redux/notebookSlice";
import { useAppDispatch } from "@/redux/hooks";

const NoteHeader: React.FC<NoteHeaderProps> = ({
  note,
  isExpanded,
  toggleExpandNote,
}) => {
  const dispatch = useAppDispatch();

  const handleDeleteNote = (id: string) => {
    dispatch(deleteNotebook(id));
  };

  return (
    <div
      className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer hover:bg-gray-200 transition"
     onClick={() => note._id && toggleExpandNote(note._id)}
    >
      <div className="flex items-center gap-2">
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        <span className="font-medium">{note.title}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (note._id) handleDeleteNote(note._id);
        }}
        className="text-red-500 hover:text-red-700 transition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default NoteHeader;
