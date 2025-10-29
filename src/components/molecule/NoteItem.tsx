// "use client";
// import React from "react";
// import { Plus } from "lucide-react";
// import PageItem from "../atom/PageItem";
// import NoteHeader from "../atom/NoteHeader";
// import { NoteItemProps } from "@/types/Note";

// const NoteItem: React.FC<NoteItemProps> = ({
//   note,
//   isExpanded,
//   toggleExpandNote,
//   handleAddPage,
//   handleDeleteNote,
//   handleDeletePage,
//   setSelectedNote,
//   setSelectedPage,
// }) => {
//   return (
//     <div className="border rounded-lg">
//       {/* Note Header */}

//       <NoteHeader
//         note={note}
//         isExpanded={isExpanded}
//         toggleExpandNote={toggleExpandNote}
//         handleDeleteNote={handleDeleteNote}
//       />

//       {/* Pages List */}
//       {isExpanded && (
//         <div className="p-3 space-y-2">
//           {note.pages.map((page) => (
//             <div key={page.id}>
//               <PageItem
//                 note={note}
//                 page={page}
//                 handleDeletePage={handleDeletePage}
//                 setSelectedNote={setSelectedNote}
//                 setSelectedPage={setSelectedPage}
//               />
//             </div>
//           ))}

//           {/* Page Button */}
//           <button
//             onClick={() => handleAddPage(note.id != null ? Number(note.id) : 0)}
//             className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mt-2"
//           >
//             <Plus size={16} />
//             Add Page
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NoteItem;

"use client";
import React from "react";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { NoteItemProps } from "@/types/Note";
import { setSelectedNote } from "@/redux/notebookSlice";
import { setSelectedPage, createPage, deletePage } from "@/redux/pageSlice";
import PageItem from "../atom/PageItem";
import NoteHeader from "../atom/NoteHeader";

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  isExpanded,
  toggleExpandNote,
  handleDeleteNote, // stays, handled via notebook thunk
}) => {
  const dispatch = useAppDispatch();

  // ✅ When note header clicked → select note + fetch pages
  const handleSelectNote = () => {
    dispatch(setSelectedNote(note._id));
  };

  // ✅ Add new page in this note
  const handleAddPage = async () => {
    if (!note._id) return;
    dispatch(
      createPage({
        title: `Page ${note.pages?.length + 1 || 1}`,
        content: "",
        notebookId: note._id,
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
          handleDeleteNote={handleDeleteNote}
        />
      </div>

      {/* Pages List */}
      {isExpanded && (
        <div className="p-3 space-y-2">
          {note.pages?.map((page) => (
            <div key={page._id}>
              <PageItem
                note={note}
                page={page}
                onSelectPage={() => dispatch(setSelectedPage(page))}
                onDeletePage={() => handleDeletePage(page._id)}
              />
            </div>
          ))}

          {/* Add Page Button */}
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

