import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProAPI, { add, remove, upload } from "../../API/ProAPI";
async function getAll() {
  const { data: products } = await ProAPI.getAll();
  const user = JSON.parse(localStorage.getItem("user"));
  const dataProducts = [];
  products?.filter((item) => {
    if (item.user_id == user._id) {
      dataProducts.push(item);
    }
  });

  return dataProducts;
}
export const getProductAll = createAsyncThunk(
  "products/getProductAll",
  async () => {
    return getAll();
  }
);
export const getProduct = createAsyncThunk(
  "products/getProduct",
  async (id) => {
    const products = await ProAPI.get(id);
    return products.data;
  }
);
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product) => {
    await add(product);
    return getAll();
  }
);
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (data) => {
    await remove(data);
    return getAll();
  }
);
export const uploadProduct = createAsyncThunk(
  "products/uploadProduct",
  async (product) => {
    await upload(product.id, product.data);
    return getAll();
  }
);
const productSlice = createSlice({
  name: "products",
  initialState: {
    value: [],
    checkData: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductAll.fulfilled, (state, action) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(uploadProduct.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default productSlice.reducer;
