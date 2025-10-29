import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "../types/Note";

interface PageState {
  list: Page[];
  selectedPage: Page | null; //
  loading: boolean;
  error: string | null;
}

const initialState: PageState = {
  list: [],
  selectedPage: null,
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:5000/api/pages";

// ✅ Fetch all pages for a specific notebook
export const fetchPages = createAsyncThunk<Page[], string>(
  "pages/fetchByNotebook",
  async (notebookId) => {
    const res = await fetch(`${BASE_URL}/notebook/${notebookId}`);
    if (!res.ok) throw new Error("Failed to fetch pages");
    return (await res.json()) as Page[];
  }
);

// ✅ Create a new page
export const createPage = createAsyncThunk(
  "pages/createPage",
  async ({
    notebookId,
    pageData,
  }: {
    notebookId: string;
    pageData: Omit<Page, "_id" | "notebookId">;
  }) => {
    const res = await fetch(`${BASE_URL}/${notebookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pageData),
    });
    const data = await res.json();
    return data; // new page
  }
);

// ✅ Update a page (PUT)
export const updatePage = createAsyncThunk<
  Page,
  { id: string; data: Partial<Page> }
>("pages/update", async ({ id, data }) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update page");
  return (await res.json()) as Page;
});

// ✅ Delete a page
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
  reducers: {
    // ✅ Select / Deselect page
    setSelectedPage: (state, action: PayloadAction<Page | null>) => {
      state.selectedPage = action.payload;
    },

    // ✅ Clear pages when switching notebook
    clearPages: (state) => {
      state.list = [];
      state.selectedPage = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟡 Fetch
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load pages";
      })

      // 🟢 Create
      .addCase(createPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPage.fulfilled, (state, action: PayloadAction<Page>) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create page";
      })

      // 🟠 Update
      .addCase(updatePage.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.selectedPage?._id === action.payload._id) {
          state.selectedPage = action.payload; // ✅ keep it in sync
        }
      })

      // 🔴 Delete
      .addCase(deletePage.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
        if (state.selectedPage?._id === action.payload) {
          state.selectedPage = null;
        }
      });
  },
});

export const { setSelectedPage, clearPages } = pageSlice.actions;
export default pageSlice.reducer;
