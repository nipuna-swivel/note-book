"use client";
import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { NoteItemProps } from "@/types/Note";
import { setSelectedNote } from "@/redux/notebookSlice";
import {
  setSelectedPage,
  createPage,
  deletePage,
  fetchPages,
} from "@/redux/pageSlice";
import PageItem from "../atom/PageItem";
import NoteHeader from "../atom/NoteHeader";

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  isExpanded,
  toggleExpandNote,
}) => {
  const dispatch = useAppDispatch();
  const {
    list: pages,
    loading,
    error,
  } = useAppSelector((state) => state.pages);

  useEffect(() => {
    if (isExpanded && note._id) {
      dispatch(fetchPages(note._id)); // fetch pages only for this notebook
    }
  }, [isExpanded, note._id, dispatch]);

  const notebookPages = pages.filter((page) => page.notebookId === note._id);

  // ✅ When note header clicked → select note + fetch pages
  const handleSelectNote = () => {
    dispatch(setSelectedNote(note._id));
  };

  const handleAddPage = async () => {
    console.log("add page clicked");
    if (!note._id) return;
    dispatch(
      createPage({
        notebookId: note._id, // this is the :id param for the backend
        pageData: { title: `Page ${note.pages?.length + 1 || 1}`, content: "" },
      })
    );
  };

  // ✅ Delete page from this note
  const handleDeletePage = (pageId: string) => {
    dispatch(deletePage(pageId));
  };

  return (
    <div className="border rounded-lg">
      {/* Note Header */}
      <div onClick={handleSelectNote}>
        <NoteHeader
          note={note}
          isExpanded={isExpanded}
          toggleExpandNote={toggleExpandNote}
        />
      </div>

      {/* Pages List */}
      {isExpanded && (
        <div className="p-3 space-y-2">
          {notebookPages.map((page) => (
            <div key={page._id}>
              <PageItem
                note={note}
                page={page}
                onSelectPage={() => dispatch(setSelectedPage(page))}
                onDeletePage={() => handleDeletePage(page._id)}
              />
            </div>
          ))}

          <button
            onClick={handleAddPage}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-2"
          >
            <Plus size={16} />
            Add Page
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteItem;
