"use client";
import React, { useState } from "react";
import SideBar from "../organism/SideBar";
import MainBar from "../organism/MainBar";

function NoteBook() {
  const [selectedNote, setSelectedNote] = useState(null);
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <SideBar setSelectedNote={setSelectedNote} />

      <div className="flex-1 overflow-y-auto">
        <MainBar selectedNote={selectedNote} />
      </div>
    </div>
  );
}

export default NoteBook;
