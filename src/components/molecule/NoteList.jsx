import React from "react";
import NoteItem from "./NoteItem";

function NoteList({
  notes,
  expandedNoteId,
  toggleExpandNote,
  handleAddPage,
  handleDeleteNote,
  handleDeletePage,
  setSelectedNote,
  setSelectedPage,
}) {
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
}

export default NoteList;
