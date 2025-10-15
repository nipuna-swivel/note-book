"use client";
import React, { useState } from "react";
import { Plus, Menu, Trash2 } from "lucide-react"; 

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState([
    { id: 1, title: "Note 1" },
    { id: 2, title: "Note 2" },
    { id: 3, title: "Note 3" },
  ]);


  const handleAddNote = () => {
    const newNote = { id: Date.now(), title: `New Note ${notes.length + 1}` };
    setNotes([...notes, newNote]);
  };

 
  const handleDeleteNote = (id:any) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <>
   
      <div className="md:hidden flex justify-between items-center p-4 border-b bg-white sticky top-0 z-20">
        <div className="text-lg font-semibold">Notes</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu size={24} />
        </button>
      </div>

     
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-screen bg-white border-r shadow-sm transform 
        transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-3/4 sm:w-2/5 md:w-1/4 p-4 z-30`}
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
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-4">No notes yet</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer group"
              >
                <div className="truncate">{note.title}</div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-1 rounded-full text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

 
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

