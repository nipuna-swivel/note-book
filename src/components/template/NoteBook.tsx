"use client";
import React from "react";
import SideBar from "../organism/SideBar";
import MainBar from "../organism/MainBar";

const NoteBook: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 overflow-y-auto">
        <MainBar />
      </div>
    </div>
  );
};

export default NoteBook;
