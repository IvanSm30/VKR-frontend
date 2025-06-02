import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "./types";

interface UserState {
  user: UserData | {};
}

const initialState: UserState = {
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = {};
    },
  },
});

export default userSlice.reducer;
