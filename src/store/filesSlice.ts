import { createSlice } from "@reduxjs/toolkit";
import { FileData } from "../components/DocumentsList/types";

interface FilesState {
  allFiles: FileData[];
  filteredFiles: FileData[];
  pendingFiles: FileData[];
  oldCount: number;
  newCount: number;
}

const initialState: FilesState = {
  allFiles: [],
  filteredFiles: [],
  pendingFiles: [],
  oldCount: 0,
  newCount: 0,
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setPendingFile: (state, action) => {
      state.pendingFiles.unshift(action.payload);
    },
    acceptFile: (state, action) => {
      const exists = state.allFiles.some(
        (file) => file.title === action.payload.title
      );
      if (!exists) {
        state.allFiles.unshift(action.payload);
        state.filteredFiles.unshift(action.payload);
        state.pendingFiles = state.pendingFiles.filter(
          (file) => file.title !== action.payload.title
        );
      }
    },
    rejectFile: (state, action) => {
      state.pendingFiles = state.pendingFiles.filter(
        (file) => file.title !== action.payload.title
      );
    },
    addFile: (state, action) => {
      const exists = state.allFiles.some(
        (file) => file.title === action.payload.title
      );
      if (!exists) {
        state.allFiles.unshift(action.payload);
        state.filteredFiles.unshift(action.payload);
      }
    },
    deleteFile: (state, action) => {
      state.allFiles = state.allFiles.filter(
        (file) => file.id !== action.payload
      );
      state.filteredFiles = state.filteredFiles.filter(
        (file) => file.id !== action.payload
      );
    },
    searchFile: (state, action) => {
      if (action.payload === "") {
        state.filteredFiles = [...state.allFiles];
      } else {
        state.filteredFiles = state.allFiles.filter((file) =>
          file.file_path.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    sortFile: (state, action) => {
      const sortOrder = action.payload;
      state.filteredFiles.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.file_path.localeCompare(b.file_path);
        } else {
          return b.file_path.localeCompare(a.file_path);
        }
      });
    },
    resetSort: (state) => {
      state.filteredFiles = [...state.allFiles];
    },
  },
});

export default filesSlice.reducer;
