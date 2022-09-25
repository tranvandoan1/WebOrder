import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OrderDetailAPI from "../../API/Orderdetail";
import { remove } from "../../API/Orderdetail";
export const getOrderDetail = createAsyncThunk(
  "orderdetail/getOrderDetail",
  async () => {
    const { data: orderdetail } = await OrderDetailAPI.getAll();
    return orderdetail;
  }
);
export const removeOrderDetail = createAsyncThunk(
  "orderDetail/removeOrderDetail",
  async (data) => {
    data.map((item) => remove(item._id));
    const { data: orderdetail } = await OrderDetailAPI.getAll();
    return orderdetail;
  }
);
const orderdetailiSlice = createSlice({
  name: "orderdetail",
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrderDetail.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeOrderDetail.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default orderdetailiSlice.reducer;
