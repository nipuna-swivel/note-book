"use client";
import React, { useState } from "react";
import { Menu, Plus, LogIn, CircleUser } from "lucide-react";
import NoteList from "../molecule/NoteList";
import { useRouter } from "next/navigation";

function SideBar({ setSelectedNote, setSelectedPage }: any) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "My First Note",
      pages: [
        { id: 1, title: "Page 1", content: "Welcome to your first note!" },
      ],
    },
  ]);

  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // Handlers
  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title: `New Note ${notes.length + 1}`,
      pages: [{ id: 1, title: "Page 1", content: "" }],
    };
    setNotes([...notes, newNote]);
    setExpandedNoteId(newNote.id);
    setSelectedNote(newNote);
    setSelectedPage(newNote.pages[0]);
  };

  const handleAddPage = (noteId: any) => {
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

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    setSelectedNote(null);
    setSelectedPage(null);
  };

  const handleDeletePage = ({ noteId, pageId }: any) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, pages: note.pages.filter((p) => p.id !== pageId) }
          : note
      )
    );
    setSelectedPage(null);
  };

  const toggleExpandNote = (id: any) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  const handleLogin = () => {
    router.push("/login"); // Uncomment when routing
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 border-b bg-white sticky top-0 z-20">
        <div className="text-lg font-semibold">Notes</div>
        <div className="flex items-center gap-3">
          {/* <button
            onClick={handleLogin}
            className="flex items-center gap-1 text-sm font-medium bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
          >
            <LogIn size={16} />
            Login
          </button> */}
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
        {/* Top Section: Login + Add Note */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/login")}
            className=" flex items-center gap-2 text-sm font-medium bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
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
}

export default SideBar;
