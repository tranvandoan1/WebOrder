import { configureStore } from "@reduxjs/toolkit";
import saveorderSlice from "../features/saveorderSlice/saveOrderSlice";
import tableSlice from "../features/TableSlice/TableSlice";
import productSlice from "../features/ProductsSlice/ProductSlice";
import categoriSlice from "../features/Categoris/CategoriSlice";
import orderSlice from "../features/Order/Order";
import allDataSlice from "../features/AllDataSlice/AllDataSlice";
import userSlice from "../features/User/UserSlice";
export const store = configureStore({
  reducer: {
    saveorder: saveorderSlice,
    table: tableSlice,
    product: productSlice,
    categori: categoriSlice,
    order: orderSlice,
    allData: allDataSlice,
    user: userSlice,
  },
});
