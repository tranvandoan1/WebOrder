import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import OrderAPI, { add, remove, upload } from "../../API/Order";
export const getAllOrder = createAsyncThunk("order/getAllOrder", async () => {
  const { data: orders } = await OrderAPI.getAll();
  const user = JSON.parse(localStorage.getItem("user"));
  const dataOrder = [];
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].user_id == user._id) {
      await dataOrder.push(orders[i]);
    }
  }

  return dataOrder;
});
export const addOrder = createAsyncThunk("order/addOrder", async (data) => {
  const { data: orders } = await add(data);
  return orders;
});
export const uploadOrder = createAsyncThunk(
  "order/uploadOrder",
  async (data) => {
    const { data: orders } = await upload(data.id, data.data);
    return orders;
  }
);
export const removeOrder = createAsyncThunk("order/removeOrder", async (id) => {
  const { data: orders } = await remove(id);
  return orders;
});
const orderSlice = createSlice({
  name: "order",
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllOrder.fulfilled, (state, action) => {
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
