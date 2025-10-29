import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "../types/Note";

interface PageState {
  list: Page[];
  loading: boolean;
  error: string | null;
}

const initialState: PageState = {
  list: [],
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000/api/pages";

// ✅ Fetch all pages for a specific notebook
export const fetchPages = createAsyncThunk<Page[], string>(
  "pages/fetchByNotebook",
  async (notebookId) => {
    const res = await fetch(`${BASE_URL}?notebookId=${notebookId}`);
    return (await res.json()) as Page[];
  }
);

// ✅ Create a new page
export const createPage = createAsyncThunk<Page, Partial<Page>>(
  "pages/create",
  async (pageData) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    return (await res.json()) as Page;
  }
);

// ✅ Update a page (PUT)
export const updatePage = createAsyncThunk<
  Page, // Return type (updated page)
  { id: string; data: Partial<Page> } // Arguments type
>("pages/update", async ({ id, data }) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update page");
  return (await res.json()) as Page;
});

// ✅ (Optional) Delete page
export const deletePage = createAsyncThunk<string, string>(
  "pages/delete",
  async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete page");
    return id;
  }
);

const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🟡 Fetch
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPages.fulfilled, (state, action: PayloadAction<Page[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load pages";
      })

      // 🟢 Create
      .addCase(createPage.fulfilled, (state, action: PayloadAction<Page>) => {
        state.list.push(action.payload);
      })

      // 🟠 Update
      .addCase(updatePage.fulfilled, (state, action: PayloadAction<Page>) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload; // replace updated page
        }
      })

      // 🔴 Delete
      .addCase(deletePage.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export default pageSlice.reducer;
