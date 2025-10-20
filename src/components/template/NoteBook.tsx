"use client";
import React, {useState } from "react";
import SideBar from "../organism/SideBar";
import MainBar from "../organism/MainBar";
import { Note, Page } from "@/types/Note";

const NoteBook: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

 

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <SideBar
        setSelectedNote={setSelectedNote}
        setSelectedPage={setSelectedPage}
      />
      <div className="flex-1 overflow-y-auto">
        <MainBar selectedNote={selectedNote} selectedPage={selectedPage} />
      </div>
    </div>
  );
};

export default NoteBook;

