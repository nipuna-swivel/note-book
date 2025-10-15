"use client";
import React, { useState, useEffect } from "react";

function MainBar({ selectedNote }) {
  const [note, setNote] = useState(null);

  useEffect(() => {
    setNote(selectedNote);
  }, [selectedNote]);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select or create a note to start editing ✍️
      </div>
    );
  }

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <input
        type="text"
        name="title"
        value={note.title}
        onChange={handleChange}
        className="w-full text-2xl font-semibold mb-4 outline-none bg-transparent border-b border-gray-200 focus:border-blue-400 transition"
        placeholder="Note title..."
      />

      <textarea
        name="content"
        value={note.content}
        onChange={handleChange}
        className="w-full h-[70vh] resize-none p-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
        placeholder="Start writing your note..."
      ></textarea>
    </div>
  );
}

export default MainBar;