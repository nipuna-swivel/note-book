import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,

} from "lucide-react";
import PageItem from "../atom/PageItem";

// Define types for Page and Note
interface Page {
  id: number;
  title: string;
}

interface Note {
  id: number;
  title: string;
  pages: Page[];
}

//types for component props
interface NoteItemProps {
  note: Note;
  isExpanded: boolean;
  toggleExpandNote: (noteId: number) => void;
  handleAddPage: (noteId: number) => void;
  handleDeleteNote: (noteId: number) => void;
  handleDeletePage: (ids: { noteId: number; pageId: number }) => void;
  setSelectedNote: (note: Note) => void;
  setSelectedPage: (page: Page) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  isExpanded,
  toggleExpandNote,
  handleAddPage,
  handleDeleteNote,
  handleDeletePage,
  setSelectedNote,
  setSelectedPage,
}) => {
  return (
    <div className="border rounded-lg">
      {/* Note Header */}
      <div
        className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer hover:bg-gray-200 transition"
        onClick={() => toggleExpandNote(note.id)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span className="font-medium">{note.title}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteNote(note.id);
          }}
          className="text-red-500 hover:text-red-700 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Pages List */}
      {isExpanded && (
        <div className="p-3 space-y-2">
          {note.pages.map((page) => (
            <div key={page.id}>
              <PageItem
                note={note}
                page={page}
                handleDeletePage={handleDeletePage}
                setSelectedNote={setSelectedNote}
                setSelectedPage={setSelectedPage}
              />
            </div>
          ))}

          {/* Add Page Button */}
          <button
            onClick={() => handleAddPage(note.id)}
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
