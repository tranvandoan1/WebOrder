import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CateAPI from "../../API/CateAPI";
import OrderAPI from "../../API/Order";
import TableAPI from "../../API/TableAPI";
import ProAPI from "../../API/ProAPI";
import { upload } from "../../API/Users";

export const getAll = createAsyncThunk("all/getAll", async () => {
  const { data: products } = await ProAPI.getAll();
  const { data: categoris } = await CateAPI.getAll();
  const { data: orders } = await OrderAPI.getAll();
  const { data: tables } = await TableAPI.getAll();
  const user = JSON.parse(localStorage.getItem("user"));

  function getAll(data) {
    const newData = [];
    data?.filter((item) => {
      if (item.user_id == user._id) {
        newData.push(item);
      }
    });
    return newData;
  }

  const allData = {
    products: getAll(products),
    categoris: getAll(categoris),
    orders: getAll(orders),
    tables: getAll(tables),
  };
  return allData;
});

const allDataSlice = createSlice({
  name: "allData",
  initialState: {
    value: {},
  },
  extraReducers: (builder) => {
    builder.addCase(getAll.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default allDataSlice.reducer;
