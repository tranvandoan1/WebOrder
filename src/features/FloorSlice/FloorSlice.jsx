import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FloorAPI, { add, remove, upload } from "../../API/FloorAPI";
export const getFloor = createAsyncThunk("floor/getFloor", async () => {
  const { data: floor } = await FloorAPI.getAll();
  return floor;
});
export const removeFloor = createAsyncThunk("floor/removeFloor", async (id) => {
  const { data: floors } = await remove(id);
  return floors;
});
export const addFloor = createAsyncThunk("floor/addFloor", async (floor) => {
  const { data } = await add(floor);
  return data;
});
export const uploadFloor = createAsyncThunk(
  "floor/uploadFloor",
  async (data) => {
    const { data: floors } = await upload(data.id, data.data);
    return floors;
  }
);

const floorSlice = createSlice({
  name: "floor",
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFloor.fulfilled, (state, action) => {
      state.value = action.payload;
    });

    builder.addCase(removeFloor.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(addFloor.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(uploadFloor.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default floorSlice.reducer;
