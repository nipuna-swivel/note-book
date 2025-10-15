"use client";
import React, { useState } from "react";
import { Plus, Menu, Trash2, FileText } from "lucide-react";

function SideBar({ setSelectedNote, setSelectedPage }) {
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

  const handleAddPage = (noteId) => {
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

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    setSelectedNote(null);
    setSelectedPage(null);
  };

  const handleDeletePage = (noteId, pageId) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, pages: note.pages.filter((p) => p.id !== pageId) }
          : note
      )
    );
    setSelectedPage(null);
  };

  const toggleExpandNote = (id) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center p-4 border-b bg-white sticky top-0 z-20">
        <div className="text-lg font-semibold">Notes</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-screen bg-white border-r shadow-sm transform 
        transition-transform duration-300 ease-in-out 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-3/4 sm:w-2/5 md:w-1/4 p-4 z-30`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Notes</h2>
          <button
            onClick={handleAddNote}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto h-[80vh]">
          {notes.map((note) => (
            <div key={note.id}>
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
              {expandedNoteId === note.id && (
                <div className="ml-4 space-y-1 border-l pl-3">
                  {note.pages.map((page) => (
                    <div
                      key={page.id}
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
                          handleDeletePage(note.id, page.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default SideBar;
