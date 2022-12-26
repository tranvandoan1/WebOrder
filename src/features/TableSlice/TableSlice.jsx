import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TableAPI, {
  add,
  addOrdersTable,
  remove,
  removeOrderTable,
  upload,
  uploadBookTable,
} from "../../API/TableAPI";
import { changeTable } from "./../../API/TableAPI";

async function tableAll() {
  const { data: tables } = await TableAPI.getAll();
  const user = JSON.parse(localStorage.getItem("user"));
  const dataTable = [];
  const newData = [];
  for (let i = 0; i < tables.length; i++) {
    if (tables[i].user_id == user._id) {
      tables[i].name = tables[i].name.replace(/[^0-9]/g, "");
      dataTable.push(tables[i]);
    }
  }

  dataTable.sort((a, b) => {
    return a.name - b.name;
  });

  for (let i = 0; i < dataTable.length; i++) {
    dataTable[i].name = `Bàn ${dataTable[i].name}`;
    dataTable[i].orders =
      dataTable[i].orders == null ? null : JSON.parse(dataTable[i].orders);
    newData.push(dataTable[i]);
  }

  return newData;
}
export const getAllTable = createAsyncThunk("table/getAllTable", async () => {
  return tableAll();
});

export const addTable = createAsyncThunk("table/addTable", async (data) => {
  await add(data);
  return tableAll();
});

export const addOrderTable = createAsyncThunk(
  "table/addOrderTable",
  async (data) => {
    await addOrdersTable(data);
    return tableAll();
  }
);
export const editBookTable = createAsyncThunk(
  "table/editBookTable",
  async (data) => {
    await uploadBookTable(data);
    return tableAll();
  }
);
export const removeTable = createAsyncThunk("table/removeTable", async (id) => {
  await remove(id);
  return tableAll();
});
export const editTable = createAsyncThunk("table/editTable", async (data) => {
  await upload(data.id, data.data);
  return tableAll();
});

export const changeTables = createAsyncThunk(
  "saveorder/changeTables",
  async (data) => {
    await changeTable(data);
    return tableAll();
  }
);
export const cancelTable = createAsyncThunk(
  "saveorder/cancelTable",
  async (data) => {
    await removeOrderTable(data);
    return tableAll();
  }
);
const tableSlice = createSlice({
  name: "table",
  initialState: {
    value: [],
    checkData: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllTable.fulfilled, (state, action) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    });
    builder.addCase(addTable.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeTable.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(editTable.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(editBookTable.fulfilled, (state, action) => {
      state.value = action.payload;
    });
 
    builder.addCase(addOrderTable.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(changeTables.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(cancelTable.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});
export default tableSlice.reducer;
