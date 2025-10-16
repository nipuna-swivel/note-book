"use client";
import React, { useState, useEffect } from "react";

function MainBar({ selectedNote, selectedPage }: any) {
  const [page, setPage] = useState(null);

  useEffect(() => {
    setPage(selectedPage);
  }, [selectedPage]);

  if (!selectedNote)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select or create a note
      </div>
    );

  if (!page)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select or create a page within{" "}
        <strong className="ml-1">{selectedNote.title}</strong>
      </div>
    );

  const handleChange = (e: any) => {
    setPage({ ...page, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">{selectedNote.title}</h1>
      <input
        type="text"
        name="title"
        value={page.title}
        onChange={handleChange}
        className="w-full text-xl font-semibold mb-3 outline-none bg-transparent border-b border-gray-200 focus:border-blue-400 transition"
        placeholder="Page title..."
      />
      <textarea
        name="content"
        value={page.content}
        onChange={handleChange}
        className="w-full h-[70vh] resize-none p-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
        placeholder="Write your notes here..."
      ></textarea>
    </div>
  );
}

export default MainBar;
