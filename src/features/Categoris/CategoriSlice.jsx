import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CateAPI, { add, remove, upload } from "../../API/CateAPI";
async function getAll() {
  const { data: categoris } = await CateAPI.getAll();
  const user = JSON.parse(localStorage.getItem("user"));
  const dataCategoris = [];
  categoris?.filter((item) => {
    if (item.user_id == user._id) {
      dataCategoris.push(item);
    }
  });

  return dataCategoris;
}
export const getCategori = createAsyncThunk(
  "categori/getCategori",
  async () => {
    return getAll();
  }
);
export const addCategori = createAsyncThunk(
  "categori/addCategori",
  async (data) => {
    await add(data);
    return getAll();
  }
);
export const removeCategori = createAsyncThunk(
  "categori/removeCategori",
  async (data) => {
    await remove(data);
    return getAll();
  }
);
export const uploadCategori = createAsyncThunk(
  "categori/uploadCategori",
  async (data) => {
    await upload(data.id, data.data);
    return getAll();
  }
);
const categoriSlice = createSlice({
  name: "categori",
  initialState: {
    value: [],
    checkData: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategori.fulfilled, (state, action) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    }),
      builder.addCase(removeCategori.fulfilled, (state, action) => {
        state.value = action.payload;
      });
    builder.addCase(uploadCategori.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default categoriSlice.reducer;
