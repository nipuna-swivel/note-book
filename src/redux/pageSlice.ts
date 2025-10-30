import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "../types/Note";
import { BASE_URL_PAGES } from "@/utils/constants";

interface PageState {
  list: Page[];
  selectedPage: Page | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: PageState = {
  list: [],
  selectedPage: null,
  saving: false,
  loading: false,
  error: null,
};

// Fetch all pages for a specific notebook
export const fetchPages = createAsyncThunk<Page[], string>(
  "pages/fetchByNotebook",
  async (notebookId) => {
    const res = await fetch(`${BASE_URL_PAGES}/notebook/${notebookId}`);
    if (!res.ok) throw new Error("Failed to fetch pages");
    return (await res.json()) as Page[];
  }
);

// Create a new page
export const createPage = createAsyncThunk(
  "pages/createPage",
  async ({
    notebookId,
    pageData,
  }: {
    notebookId: string;
    pageData: Omit<Page, "_id" | "notebookId">;
  }) => {
    const res = await fetch(`${BASE_URL_PAGES}/${notebookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pageData),
    });
    const data = await res.json();
    return data;
  }
);

// Update a page (PUT)
export const updatePage = createAsyncThunk<
  Page,
  { pageId: string; data: Partial<Page> }
>("pages/update", async ({ pageId, data }) => {
  const res = await fetch(`${BASE_URL_PAGES}/${pageId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update page");
  return (await res.json()) as Page;
});

// Delete a page
export const deletePage = createAsyncThunk<string, string>(
  "pages/delete",
  async (id) => {
    const res = await fetch(`${BASE_URL_PAGES}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete page");
    return id;
  }
);

const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    // Select / Deselect page
    setSelectedPage: (state, action: PayloadAction<Page | null>) => {
      state.selectedPage = action.payload;
    },

    //clear pages when switching pages
    clearSelectedPage: (state) => {
      state.selectedPage = null;
    },

    // Clear pages when switching notebook
    clearPages: (state) => {
      state.list = [];
      state.selectedPage = null;
      state.error = null;
      state.loading = false;
    },

    //update selected page locally
    updateSelectedPageLocal: (state, action) => {
      if (state.selectedPage) {
        state.selectedPage = { ...state.selectedPage, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
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

      // Create
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

      //  Update
      .addCase(updatePage.pending, (state) => {
        state.saving = true;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selectedPage?._id === action.payload._id) {
          state.selectedPage = action.payload;
        }
      })
      .addCase(updatePage.rejected, (state) => {
        state.saving = false;
      })

      //  Delete
      .addCase(deletePage.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
        if (state.selectedPage?._id === action.payload) {
          state.selectedPage = null;
        }
      });
  },
});

export const {
  setSelectedPage,
  clearPages,
  clearSelectedPage,
  updateSelectedPageLocal,
} = pageSlice.actions;
export default pageSlice.reducer;
