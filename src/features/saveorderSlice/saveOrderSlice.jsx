import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SaveorderAPI, {
  add,
  upload,
  remove,
  updateFind,
  removes,
  changeTable,
} from "../../API/SaveOrder";
async function getAll() {
  const { data: saveorders } = await SaveorderAPI.getAll();
  const user = JSON.parse(localStorage.getItem("user"));
  const dataSaveOrder = [];
  saveorders?.filter((item) => {
    if (item.id_user == user._id) {
      dataSaveOrder.push(item);
    }
  });

  return dataSaveOrder;
}
export const getAllSaveOrder = createAsyncThunk(
  "saveOrder/getAll",
  async () => {
    return getAll();
  }
);
export const addSaveOrder = createAsyncThunk(
  "saveorder/addSaveOrder",
  async (data) => {
    const { data: saveorders } = await add(data);
    return saveorders;
  }
);
export const uploadSaveOrder = createAsyncThunk(
  "saveorder/uploadSaveOrder",
  async (data) => {
    const { data: saveorders } = await upload(data.id, data.data);
    return saveorders;
  }
);
export const removeSaveOrder = createAsyncThunk(
  "saveorder/removeSaveOrder",
  async (id) => {
    const { data: saveorders } = await remove(id);
    return saveorders;
  }
);
export const uploadSaveOrderFind = createAsyncThunk(
  "saveorder/uploadSaveOrderFind",
  async (data) => {
    await updateFind(data.id, data.data);
    return getAll();
  }
);
export const removeSaveOrderAll = createAsyncThunk(
  "saveorder/removeSaveOrderAll",
  async (data) => {
    await removes(data);
    return getAll();
  }
);
export const changeTables = createAsyncThunk(
  "saveorder/changeTables",
  async (data) => {
    await changeTable(data);

    return getAll();
  }
);
const saveOrderSlice = createSlice({
  name: "table",
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSaveOrder.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(addSaveOrder.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(uploadSaveOrder.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeSaveOrder.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeSaveOrderAll.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(uploadSaveOrderFind.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(changeTables.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default saveOrderSlice.reducer;
