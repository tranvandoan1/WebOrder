import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import OrderAPI, { add, remove, upload } from "../../API/Order";
async function getAll() {
  const { data: orders } = await OrderAPI.getAll();
  const user = JSON.parse(localStorage.getItem("user"));
  const dataOrder = [];
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].user_id == user._id) {
      await dataOrder.push(orders[i]);
    }
  }

  return dataOrder;
}
export const getAllOrder = createAsyncThunk("order/getAllOrder", async () => {
  return getAll();
});
export const addOrder = createAsyncThunk("order/addOrder", async (data) => {
  await add(data);
  return getAll();
});
export const uploadOrder = createAsyncThunk(
  "order/uploadOrder",
  async (data) => {
    await upload(data.id, data.data);
    return getAll();
  }
);
export const removeOrder = createAsyncThunk("order/removeOrder", async (id) => {
  await remove(id);
  return getAll();
});
const orderSlice = createSlice({
  name: "order",
  initialState: {
    value: [],
    checkData: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllOrder.fulfilled, (state, action) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    });
    builder.addCase(addOrder.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(uploadOrder.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeOrder.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default orderSlice.reducer;
