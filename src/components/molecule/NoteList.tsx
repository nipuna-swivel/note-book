import React from "react";
import NoteItem from "./NoteItem";

// Reuse the same interfaces used in NoteItem
interface Page {
  id: number;
  title: string;
}

interface Note {
  id: number;
  title: string;
  pages: Page[];
}

interface NoteListProps {
  notes: Note[];
  expandedNoteId: number | null;
  toggleExpandNote: (noteId: number) => void;
  handleAddPage: (noteId: number) => void;
  handleDeleteNote: (noteId: number) => void;
  handleDeletePage: (ids: { noteId: number; pageId: number }) => void;
  setSelectedNote: (note: Note) => void;
  setSelectedPage: (page: Page) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  expandedNoteId,
  toggleExpandNote,
  handleAddPage,
  handleDeleteNote,
  handleDeletePage,
  setSelectedNote,
  setSelectedPage,
}) => {
  return (
    <div className="space-y-2 overflow-y-auto h-[80vh]">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isExpanded={expandedNoteId === note.id}
          toggleExpandNote={toggleExpandNote}
          handleAddPage={handleAddPage}
          handleDeleteNote={handleDeleteNote}
          handleDeletePage={handleDeletePage}
          setSelectedNote={setSelectedNote}
          setSelectedPage={setSelectedPage}
        />
      ))}
    </div>
  );
};

export default NoteList;

