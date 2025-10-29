// import React, { useState, useEffect, ChangeEvent } from "react";
// import { Page, MainBarProps } from "@/types/Note";

// const MainBar: React.FC<MainBarProps> = ({ selectedNote, selectedPage }) => {
//   const [page, setPage] = useState<Page | null>(null);

//   useEffect(() => {
//     setPage(selectedPage);
//   }, [selectedPage]);

//   if (!selectedNote)
//     return (
//       <div className="flex items-center justify-center h-full text-gray-500">
//         Select or create a note
//       </div>
//     );

//   if (!page)
//     return (
//       <div className="flex items-center justify-center h-full text-gray-500">
//         Select or create a page within{" "}
//         <strong className="ml-1">{selectedNote.title}</strong>
//       </div>
//     );

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setPage((prev) => (prev ? { ...prev, [name]: value } : prev));
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto w-full">
//       <h1 className="text-2xl font-bold mb-4">{selectedNote.title}</h1>
//       <input
//         type="text"
//         name="title"
//         value={page.title}
//         onChange={handleChange}
//         className="w-full text-xl font-semibold mb-3 outline-none bg-transparent border-b border-gray-200 focus:border-blue-400 transition"
//         placeholder="Page title..."
//       />
//       <textarea
//         name="content"
//         value={page.content}
//         onChange={handleChange}
//         className="w-full h-[70vh] resize-none p-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
//         placeholder="Write your notes here..."
//       />
//     </div>
//   );
// };

// export default MainBar;

"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { updatePage } from "@/redux/pageSlice"; // ✅ you'll create this thunk (we already discussed it)
import { Page } from "@/types/Note";

const MainBar: React.FC = () => {
  const dispatch = useAppDispatch();

  // ✅ Read from Redux instead of props
  const { selectedNote, selectedPage } = useAppSelector(
    (state) => state.notebooks
  );

  // Local editable page state (so typing is smooth)
  const [page, setPage] = useState<Page | null>(null);

  // Sync when Redux selectedPage changes
  useEffect(() => {
    setPage(selectedPage);
  }, [selectedPage]);

  // 🧠 Guard states
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

  // ✅ Update local state on typing
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPage((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // ✅ Optional: Auto-save after delay (debounced)
  useEffect(() => {
    if (!page || !page._id) return;

    const timeout = setTimeout(() => {
      dispatch(
        updatePage({
          id: page._id,
          data: { title: page.title, content: page.content },
        })
      );
    }, 800); // save after user stops typing for 0.8s

    return () => clearTimeout(timeout);
  }, [page, dispatch]);

  return (
    <div className="p-6 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">{selectedNote.title}</h1>

      {/* Page title */}
      <input
        type="text"
        name="title"
        value={page.title}
        onChange={handleChange}
        className="w-full text-xl font-semibold mb-3 outline-none bg-transparent border-b border-gray-200 focus:border-blue-400 transition"
        placeholder="Page title..."
      />

      {/* Page content */}
      <textarea
        name="content"
        value={page.content}
        onChange={handleChange}
        className="w-full h-[70vh] resize-none p-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-300 outline-none"
        placeholder="Write your notes here..."
      />
    </div>
  );
};

export default MainBar;
