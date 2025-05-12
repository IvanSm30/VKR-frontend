import { createSlice } from "@reduxjs/toolkit";
import { FileData } from "../components/DocumentsList/types";

const initialState = {
  allFiles: [] as FileData[],
  filteredFiles: [] as FileData[],
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.allFiles.push(action.payload);
      state.filteredFiles.push(action.payload);
    },
    deleteFile: (state, action) => {
      state.allFiles = state.allFiles.filter((file) => file.file_path !== action.payload);
      state.filteredFiles = state.filteredFiles.filter((file) => file.file_path !== action.payload);
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
        if (sortOrder === 'asc') {
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

export const { addFile, deleteFile, searchFile, sortFile, resetSort } = filesSlice.actions;

export default filesSlice.reducer;
