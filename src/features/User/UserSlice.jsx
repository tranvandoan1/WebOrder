import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserAPI, { getAllUser, upload, uploadLogin } from "./../../API/Users";
export const getUser = createAsyncThunk("user/getUser", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { data: users } = await getAllUser();
  const userFind = users.find((item) => item._id == user._id);
  return userFind;
});
export const editNameAvatarUser = createAsyncThunk("user/editNameAvatarUser", async (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { data: users } = await upload(data);
  const userFind = users.find((item) => item._id == user._id);
  return userFind;
});
export const editLogin = createAsyncThunk("user/editLogin", async (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { data: users } = await uploadLogin(data);
  const userFind = users.find((item) => item._id == user._id);
  return userFind;
});
const userSlice = createSlice({
  name: "user",
  initialState: {
    value: [],
    checkData: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    });
    builder.addCase(editNameAvatarUser.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(editLogin.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default userSlice.reducer;
