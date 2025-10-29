"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NoteItem from "./NoteItem";
import { RootState } from "@/redux/store";
import { setSelectedNote } from "@/redux/notebookSlice";
import { setSelectedPage, fetchPages } from "@/redux/pageSlice";

const NoteList: React.FC = () => {
  const dispatch = useDispatch();
  const { list: notes, loading } = useSelector((state: RootState) => state.notebooks);
  const { selectedNote } = useSelector((state: RootState) => state.notebooks);
  const { selectedPage } = useSelector((state: RootState) => state.pages);
  const [expandedNoteId, setExpandedNoteId] = React.useState<number | string | null>(null);

  const toggleExpandNote = (id: number | string) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  const handleNoteClick = (noteId: string) => {
    const note = notes.find((n) => n._id === noteId);
    if (note) {
      dispatch(setSelectedNote(note));
      dispatch(fetchPages(note._id)); // ✅ load that notebook’s pages
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-500">Loading notebooks...</p>;
  }

  return (
    <div className="space-y-2 overflow-y-auto h-[80vh]">
      {notes.map((note,index) => (
        <NoteItem
          key={note._id || index}
          note={note}
          isExpanded={expandedNoteId === note._id}
          toggleExpandNote={toggleExpandNote}
          onSelectNote={() => handleNoteClick(note._id)}
          onSelectPage={(page) => dispatch(setSelectedPage(page))}
        />
      ))}
    </div>
  );
};

export default NoteList;

