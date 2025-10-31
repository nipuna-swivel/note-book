"use client";
import React, { useEffect, useState } from "react";
import { Menu, Plus, CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchNotebooks,
  createNotebook,
  setSelectedNote,
  setSelectedPage,
} from "@/redux/notebookSlice";
import NoteList from "../molecule/NoteList";
import { Note } from "@/types/Note";

const SideBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    list: notebooks,
    loading,
  } = useAppSelector((state) => state.notebooks);

  const [isOpen, setIsOpen] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchNotebooks());
  }, [dispatch]);

  const handleAddNote = () => {
    dispatch(createNotebook({ title: `New Note ${notebooks.length + 1}` }));
  };



  const toggleExpandNote = (id: string) => {
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
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 w-3/4 sm:w-2/5 md:w-1/4 p-4 z-30 flex flex-col`}
      >
        {/* Header buttons */}
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

        {/* Notebooks List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-500 mt-10">Loading...</div>
          ) : notebooks.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No notebooks yet
            </div>
          ) : (
            <NoteList           
              expandedNoteId={expandedNoteId}
              toggleExpandNote={toggleExpandNote}        
          
            />
          )}
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
