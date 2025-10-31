export interface Page {
  _id?: string |undefined;
  notebookId: string;
  title: string;
  content: string;
}

export interface Note {
  _id: string |null;
  title: string;
  pages: Page[];
}

export interface NoteItemProps {
  note: Note ;
  isExpanded: boolean;
  toggleExpandNote: (noteId: number) => void;
  handleAddPage: (noteId: number) => void;
  handleDeleteNote: (noteId: number) => void;
  handleDeletePage: (ids: { noteId: number; pageId: number }) => void;
  setSelectedNote: (note: Note) => void;
  setSelectedPage: (page: Page) => void;
}



export interface NoteHeaderProps {
  note: Note;
  isExpanded: boolean;
  toggleExpandNote: (noteId: number) => void;
//  handleDeleteNote: (noteId: number) => void;
}


export interface PageItemProps {
  page: Page;
  note: Note;
 // setSelectedNote: (note: Note) => void;
//  setSelectedPage: (page: Page) => void;
//  handleDeletePage: (ids: { noteId: number; pageId: number }) => void;
}

export interface NoteListProps {
  notes: Note[];
  expandedNoteId: number | null |string;
  toggleExpandNote: (noteId: number) => void;
  handleAddPage: (noteId: number) => void;
  handleDeleteNote: (noteId: number) => void;
  handleDeletePage: (ids: { noteId: number; pageId: number }) => void;
  setSelectedNote: (note: Note) => void;
  setSelectedPage: (page: Page) => void;
}

export interface SideBarProps {
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
  setSelectedPage: React.Dispatch<React.SetStateAction<Page | null>>;
}

export interface MainBarProps {
  selectedNote: Note | null;
  selectedPage: Page | null;
}
