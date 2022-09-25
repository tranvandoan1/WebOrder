import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserAPI, { getAllUser, upload } from "./../../API/Users";
export const getUser = createAsyncThunk("user/getUser", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { data: users } = await getAllUser();
  const userFind = users.find((item) => item._id == user._id);
  return userFind;
});
export const editUser = createAsyncThunk("user/editUser", async (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { data: users } = await upload(data);
  const userFind = users.find((item) => item._id == user._id);
  return userFind;
});
const userSlice = createSlice({
  name: "user",
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default userSlice.reducer;
