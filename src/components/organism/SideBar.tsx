"use client";
import React, { useState } from "react";
import { Menu, Plus, CircleUser } from "lucide-react";
import NoteList from "../molecule/NoteList";
import { useRouter } from "next/navigation";

// Define types for Page and Note
interface Page {
  id: number;
  title: string;
  content: string;
}

interface Note {
  id: number;
  title: string;
  pages: Page[];
}

// Props expected by the SideBar component
interface SideBarProps {
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
  setSelectedPage: React.Dispatch<React.SetStateAction<Page | null>>;
}

const SideBar: React.FC<SideBarProps> = ({
  setSelectedNote,
  setSelectedPage,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "My First Note",
      pages: [
        { id: 1, title: "Page 1", content: "Welcome to your first note!" },
      ],
    },
  ]);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

  // Add a new note
  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: `New Note ${notes.length + 1}`,
      pages: [{ id: 1, title: "Page 1", content: "" }],
    };
    setNotes([...notes, newNote]);
    setExpandedNoteId(newNote.id);
    setSelectedNote(newNote);
    setSelectedPage(newNote.pages[0]);
  };

  // Add a new page inside a note
  const handleAddPage = (noteId: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? {
              ...note,
              pages: [
                ...note.pages,
                {
                  id: Date.now(),
                  title: `Page ${note.pages.length + 1}`,
                  content: "",
                },
              ],
            }
          : note
      )
    );
  };

  // Delete a note
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    setSelectedNote(null);
    setSelectedPage(null);
  };

  // Delete a page
  const handleDeletePage = ({
    noteId,
    pageId,
  }: {
    noteId: number;
    pageId: number;
  }) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, pages: note.pages.filter((p) => p.id !== pageId) }
          : note
      )
    );
    setSelectedPage(null);
  };

  // ⬇️ Expand / collapse a note
  const toggleExpandNote = (id: number) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 border-b bg-white sticky top-0 z-20">
        <div className="text-lg font-semibold">Notes</div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-screen bg-white border-r shadow-sm transform 
        transition-transform duration-300 ease-in-out 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-3/4 sm:w-2/5 md:w-1/4 p-4 z-30 flex flex-col`}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-sm font-medium bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <CircleUser />
            Login
          </button>

          <button
            onClick={handleAddNote}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          <NoteList
            notes={notes}
            expandedNoteId={expandedNoteId}
            toggleExpandNote={toggleExpandNote}
            handleAddPage={handleAddPage}
            handleDeleteNote={handleDeleteNote}
            handleDeletePage={handleDeletePage}
            setSelectedNote={setSelectedNote}
            setSelectedPage={setSelectedPage}
          />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-40 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBar;
