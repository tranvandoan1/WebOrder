import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Orders from "./Page/Orders";
import LayoutWeb from "./Page/LayoutWeb";
import ListCate from "./Manage/Categoris/ListCate";
import LayoutAdmin from "./Manage/LayoutAdmin";
import ListPro from "./Manage/Products/ListPro";
import ListOder from "./Manage/ListOder";
import Account from "./Manage/Account/Account";
import Signin from "./Login/Signin";
import PicturesWall from "./Login/Signup";
import AddCate from "./Manage/Categoris/AddCate";
import EditCate from "./Manage/Categoris/EditCate";
import AddPro from "./Manage/Products/AddPro";

import ListTablee from "./Manage/Table/ListTable";

import AddTable from "./Manage/Table/AddTable";
import EditTable from "./Manage/Table/EditTable";
import EditPro from "./Manage/Products/EditPro";
import ListStatistical from "./Manage/Statistical/ListStatistical";

import "./App.css";
import Introduce from "./Introduce";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { getProductAll } from "./features/ProductsSlice/ProductSlice";
import { getCategori } from "./features/Categoris/CategoriSlice";
import { getAllTable } from "./features/TableSlice/TableSlice";
import Setting from "./Manage/Setting";
import { getUser } from "./features/User/UserSlice";
import Privateadmin from "./privateAdmin";
import Notfound from "./Notfound";
function App() {
  const user = useSelector((data) => data.user.value);

  useEffect(() => {
    dispatch(getUser());
  }, []);
  const dispatch = useDispatch();
  const products = useSelector((data) => data.product.value);
  const tables = useSelector((data) => data.table.value);
  const categoris = useSelector((data) => data.categori.value);
  useEffect(() => {
    dispatch(getProductAll());
    dispatch(getCategori());
    dispatch(getAllTable());
  }, []);
  return (
    <BrowserRouter>
      {/* {Object.keys(user).length > 0 ? ( */}
      <Routes>
        <Route
          path="/"
          element={
            user?.loginWeb == 0 ? (
              tables?.length <= 0 ? (
                <Navigate to="/intro" />
              ) : user?.loginWeb == 0 && tables?.length > 0 ? (
                <Navigate to="/tables" />
              ) : (
                <Signin />
              )
            ) : tables?.length <= 0 ? (
              <Navigate to="/manager/table" />
            ) : user?.loginWeb == 0 && tables?.length > 0 ? (
              <Navigate to="/tables" />
            ) : (
              <Signin />
            )
          }
        />

        <Route
          path="/signin"
          element={
            Object.keys(user)?.length > 0 ? (
              <Navigate to="/tables" />
            ) : (
              <Signin />
            )
          }
        />
        <Route
          path="/signup"
          element={
            Object.keys(user)?.length > 0 ? (
              <Navigate to="/tables" />
            ) : (
              <PicturesWall />
            )
          }
        />

        <Route
          path="/tables/"
          element={
            tables?.length <= 0 ? (
              <Navigate to="/manager/table" />
            ) : (
              <LayoutWeb />
            )
          }
        />

        <Route
          path="/order/table-name=:name&&:id"
          element={
            Object.keys(user)?.length <= 0 && user?.loginWeb !== 0 ? (
              <Navigate to="/signin" />
            ) : (
              <Orders />
            )
          }
        />

        <Route
          path="/manager/"
          element={
            // Object.keys(user)?.length <= 0 ? (
            //   <Navigate to="/signin" />
            // ) : (
              <LayoutAdmin />
            // )
          }
        >
          {/* cate */}
          <Route
            path="categoris/"
            element={
              Object.keys(user)?.length <= 0 ? (
                <Navigate to="/signin" />
              ) : (
                <ListCate />
              )
            }
          ></Route>
          <Route
            path="categoris/add"
            element={
              Object.keys(user)?.length <= 0 ? (
                <Navigate to="/signin" />
              ) : (
                <AddCate />
              )
            }
          />
          <Route
            path="categoris/edit=:id"
            element={
              Object.keys(user)?.length <= 0 ? (
                <Navigate to="/signin" />
              ) : (
                <EditCate />
              )
            }
          />
          {/* pro */}
          <Route
            path="products"
            element={
              // Object.keys(user)?.length <= 0 ? (
              //   <Navigate to="/signin" />
              // ) : (
                <ListPro />
              // )
            }
          />
          <Route
            path="products/add"
            element={
              Object.keys(user)?.length <= 0 ? (
                <Navigate to="/signin" />
              ) : (
                <AddPro />
              )
            }
          />
          <Route
            path="products/edit=:id"
            element={
              Object.keys(user)?.length <= 0 ? (
                <Navigate to="/signin" />
              ) : (
                <EditPro />
              )
            }
          />

          {/* bàn */}
          <Route
            path="table"
            element={
              Object.keys(user)?.length <= 0 ? (
                <Navigate to="/signin" />
              ) : (
                <ListTablee />
              )
            }
          />
          <Route
            path="table/add"
            element={
              Object.keys(user)?.length <= 0 ? (
                <Navigate to="/signin" />
              ) : (
                <AddTable />
              )
            }
          />
          <Route
            path="table/edit=:id"
            element={
              Object.keys(user)?.length <= 0 ? (
                <Navigate to="/signin" />
              ) : (
                <EditTable />
              )
            }
          />
          {/* thống kê */}
          {(user?.loginWeb !== 0 || tables?.length > 0) && (
            <Route
              path="statistical"
              element={
                Object.keys(user)?.length <= 0 ? (
                  <Navigate to="/signin" />
                ) : (
                  <ListStatistical />
                )
              }
            />
          )}

          <Route
            path="account"
            element={
              Object.keys(user)?.length <= 0 && user?.loginWeb !== 0 ? (
                <Navigate to="/signin" />
              ) : (
                <Account />
              )
            }
          />

          <Route
            path="order"
            element={
              Object.keys(user)?.length <= 0 && user?.loginWeb !== 0 ? (
                <Navigate to="/signin" />
              ) : (
                <ListOder />
              )
            }
          />
          <Route
            path="setting"
            element={
              Object.keys(user)?.length <= 0 && user?.loginWeb !== 0 ? (
                <Navigate to="/signin" />
              ) : (
                <Setting />
              )
            }
          />
        </Route>
      </Routes>
      {/* )
      //  : (
      //   <Routes>
      //     <Route
      //       path="/"
      //       element={
      //         Object.keys(user)?.length > 0 ? (
      //           <Navigate to="/tables" />
      //         ) : (
      //           <Privateadmin>
      //             <Signin />
      //           </Privateadmin>
      //         )
      //       }
      //     />

      //     <Route
      //       path="/signin"
      //       element={
      //         Object.keys(user)?.length > 0 ? (
      //           <Navigate to="/tables" />
      //         ) : (
      //           <Privateadmin>
      //             <Signin />
      //           </Privateadmin>
      //         )
      //       }
      //     />
      //     <Route
      //       path="/signup"
      //       element={
      //         Object.keys(user)?.length > 0 ? (
      //           <Navigate to="/tables" />
      //         ) : (
      //           <PicturesWall />
      //         )
      //       }
      //     />
      //   </Routes>
      // )} */}
      <Routes>
        <Route path="/404" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
