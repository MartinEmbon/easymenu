import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  userRole: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.userRole = action.payload.userRole;
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.userRole = null;
    }
  }
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
