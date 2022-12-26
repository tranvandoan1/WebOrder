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
import Introduce from "./components/Introduce";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { getAllTable } from "./features/TableSlice/TableSlice";
import Setting from "./Manage/Setting";
import { getUser } from "./features/User/UserSlice";
import Notfound from "./components/Notfound";
import PrivateData from "./CheckRole/privateData";
import Loading from './components/Loading';
function App() {
  const userLoca = JSON.parse(localStorage.getItem("user"));
  const user = useSelector((data) => data.user);
  const dispatch = useDispatch();
  const tables = useSelector((data) => data.table);
  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllTable());
  }, []);
  const avatarWeb = document.getElementById("avatarWeb");
  const nameWeb = document.getElementById("nameWeb");
  avatarWeb.href =
    String(user?.value.avatarRestaurant).length <= 0 ||
    user?.value.avatarRestaurant == null ||
    user?.value.avatarRestaurant == undefined
      ? "https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg"
      : user?.value.avatarRestaurant;
  nameWeb.innerHTML =
    user?.value.nameRestaurant == undefined ||
    user?.value.nameRestaurant == null ||
    String(user?.value.nameRestaurant).length <= 0
      ? "WebSite Order"
      : user?.value.nameRestaurant;
  const key = JSON.parse(localStorage.getItem("key"));
  return (
    <BrowserRouter>
      {userLoca !== null ? (
        String(user.value).length <= 0 ? (
          <Loading />
        ) : (
          <Routes>
            <Route
              errorElement={<Notfound />}
              path="/"
              element={
                user?.value.count == 0 &&
                tables.value.length <= 0 &&
                tables.checkData == false ? (
                  <Introduce />
                ) : user?.value.count == 0 &&
                  tables.value.length <= 0 &&
                  tables.checkData == true ? (
                  <Introduce />
                ) : user?.value.count == 1 &&
                  tables.value.length <= 0 &&
                  tables.checkData == true ? (
                  (key == undefined || key == null
                    ? localStorage.setItem("key", JSON.stringify(["2"]))
                    : null,
                  (<Navigate to="/manager/table" />))
                ) : user?.value.count == 1 &&
                  tables.value.length > 0 &&
                  tables.checkData == false ? (
                  <LayoutWeb />
                ) : null
              }
            />

            <Route
              errorElement={<Notfound />}
              path="/signin"
              element={
                userLoca !== null ? <Navigate to="/tables" /> : <Signin />
              }
            />
            <Route
              errorElement={<Notfound />}
              path="/signup"
              element={
                userLoca !== null ? <Navigate to="/tables" /> : <PicturesWall />
              }
            />

            <Route
              errorElement={<Notfound />}
              path="/tables/"
              element={
                user?.value.accountType == 0 ? (
                  <Navigate to="/" />
                ) : (
                  <LayoutWeb />
                )
              }
            />

            <Route
              path="/order/:name/:id"
              element={<Orders />}
              errorElement={<Notfound />}
            />
            <Route
              errorElement={<Notfound />}
              path="/manager/"
              element={
                <PrivateData>
                  <LayoutAdmin />
                </PrivateData>
              }
            >
              {/* cate */}
              <Route
                errorElement={<Notfound />}
                path="categoris/"
                element={<ListCate />}
              ></Route>
              <Route
                errorElement={<Notfound />}
                path="categoris/add"
                element={<AddCate />}
              />
              <Route
                errorElement={<Notfound />}
                path="categoris/edit/:id"
                element={<EditCate />}
              />
              {/* pro */}
              <Route
                errorElement={<Notfound />}
                path="products"
                element={<ListPro />}
              />
              <Route
                errorElement={<Notfound />}
                path="products/add"
                element={<AddPro />}
              />
              <Route
                errorElement={<Notfound />}
                path="products/edit/:id"
                element={<EditPro />}
              />

              {/* bàn */}
              <Route
                errorElement={<Notfound />}
                path="table"
                element={<ListTablee />}
              />
              <Route
                errorElement={<Notfound />}
                path="table/add"
                element={<AddTable />}
              />
              <Route
                errorElement={<Notfound />}
                path="table/edit/:id"
                element={<EditTable />}
              />
              {/* thống kê */}
              <Route
                errorElement={<Notfound />}
                path="statistical"
                element={<ListStatistical />}
              />

              <Route
                errorElement={<Notfound />}
                path="account"
                element={<Account />}
              />

              <Route
                errorElement={<Notfound />}
                path="order"
                element={<ListOder />}
              />
              <Route
                errorElement={<Notfound />}
                path="setting"
                element={<Setting />}
              />
            </Route>
          </Routes>
        )
      ) : (
        <Routes>
          <Route errorElement={<Notfound />} path="/" element={<Signin />} />
          <Route
            errorElement={<Notfound />}
            path="/signin"
            element={<Signin />}
          />
          <Route
            errorElement={<Notfound />}
            path="/signup"
            element={<PicturesWall />}
          />
        </Routes>
      )}

      <Routes>
        <Route errorElement={<Notfound />} path="/404" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
