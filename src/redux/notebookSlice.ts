import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Note,Page } from "../types/Note";

interface NotebookState {
  list: Note[];
  selectedNote: Note | null;
  selectedPage: Page | null;
  loading: boolean;
  error: string | null;
}

const initialState: NotebookState = {
  list: [],
  selectedNote: null,
  selectedPage: null,
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000/api/notebooks";

// Async Thunks
export const fetchNotebooks = createAsyncThunk<Note[]>(
  "notebooks/fetchAll",
  async () => {
    const res = await fetch(BASE_URL);
    return (await res.json()) as Note[];
  }
);

export const createNotebook = createAsyncThunk<Note, { title: string }>(
  "notebooks/create",
  async (data) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return (await res.json()) as Note;
  }
);

export const deleteNotebook = createAsyncThunk<string, string>(
  "notebooks/delete",
  async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    return id;
  }
);

const notebookSlice = createSlice({
  name: "notebooks",
  initialState,
  reducers: {
      //  Manage selected items globally
    setSelectedNote: (state, action: PayloadAction<Note | null>) => {
      state.selectedNote = action.payload;
      state.selectedPage = null; // reset page when switching notebook
    },
    setSelectedPage: (state, action: PayloadAction<Page | null>) => {
      state.selectedPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotebooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotebooks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotebooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load notebooks";
      })
      .addCase(createNotebook.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.selectedNote = action.payload;
        state.selectedPage = action.payload.pages?.[0] || null;
      })
    //   .addCase(updateNotebook.fulfilled, (state, action) => {
    //     const index = state.list.findIndex((n) => n._id === action.payload._id);
    //     if (index !== -1) {
    //       state.list[index] = action.payload;
    //     }
    //     if (state.selectedNote?._id === action.payload._id) {
    //       state.selectedNote = action.payload; // keep current note updated
    //     }
    //   })
      .addCase(deleteNotebook.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n._id !== action.payload);
        if (state.selectedNote?._id === action.payload) {
          state.selectedNote = null;
          state.selectedPage = null;
        }
      });
  },
});

export const { setSelectedNote, setSelectedPage } = notebookSlice.actions;
export default notebookSlice.reducer;
