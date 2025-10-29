import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "../types/Note";

interface NotebookState {
  list: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotebookState = {
  list: [],
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

export const createNotebook = createAsyncThunk<Note, { name: string }>(
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotebooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotebooks.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotebooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load notebooks";
      })
      .addCase(createNotebook.fulfilled, (state, action: PayloadAction<Note>) => {
        state.list.push(action.payload);
      })
      .addCase(deleteNotebook.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((n) => n._id !== action.payload);
      });
  },
});

export default notebookSlice.reducer;
