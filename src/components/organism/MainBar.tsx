"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { updatePage, updateSelectedPageLocal } from "@/redux/pageSlice";

const MainBar: React.FC = () => {
  const dispatch = useAppDispatch();

  const selectedNote = useAppSelector((state) => state.notebooks.selectedNote);
  const selectedPage = useAppSelector((state) => state.pages.selectedPage);
  const saving = useAppSelector((state) => state.pages.saving);

  // local state (user typing)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (selectedPage) {
      setTitle(selectedPage.title || "");
      setContent(selectedPage.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedPage]);

  const handleBlur = () => {
    console.log("Blur fired")


    dispatch(
      updatePage({
        pageId: selectedPage._id,
        data: { title, content },
      })
    );
  };

  if (!selectedNote)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select or create a note
      </div>
    );

  if (!selectedPage)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select or create a page within{" "}
        <strong className="ml-1">{selectedNote.title}</strong>
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-2">{selectedNote.title}</h1>

      
      <div className="text-sm text-gray-500 mb-3 text-right">
        {saving ? (
          <span className="animate-pulse">Saving...</span>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>

      {/* Page title */}
      <input
        type="text"
        name="title"
        value={title}
        className="w-full text-xl font-semibold mb-3 outline-none bg-transparent border-b border-gray-200 focus:border-blue-400 transition"
        placeholder="Page title..."
        onChange={(e) => {
          setTitle(e.target.value);
          dispatch(updateSelectedPageLocal({ title: e.target.value }));
        }}
        onBlur={handleBlur}
      />

      {/* Page content */}
      <textarea
        name="content"
        value={content}
        className="w-full h-[70vh] resize-none p-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
        placeholder="Write your notes here..."
        onChange={(e) => {
          setContent(e.target.value);
          dispatch(updateSelectedPageLocal({ content: e.target.value }));
        }}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default MainBar;
