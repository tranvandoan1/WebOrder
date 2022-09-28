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
import { getAllTable } from "./features/TableSlice/TableSlice";
import Setting from "./Manage/Setting";
import { getUser } from "./features/User/UserSlice";
import Notfound from "./Notfound";
import PrivateLogin from "./CheckRole/privateLogin";
import Loading from "./Loading";
import PrivateData from "./CheckRole/privateData";
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
    String(user?.value.avatarRestaurant).length <= 0
      ? "https://png.pngtree.com/png-vector/20190805/ourlarge/pngtree-account-avatar-user-abstract-circle-background-flat-color-icon-png-image_1650938.jpg"
      : user?.value.avatarRestaurant;
  nameWeb.innerHTML =
    String(user?.value.nameRestaurant).length <= 0
      ? "WebSite Order"
      : user?.value.nameRestaurant;
  return (
    <BrowserRouter>
      {userLoca !== null ? (
        String(user.value).length <= 0 ? (
          <Loading />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                user?.value.loginWeb == 0 &&
                tables.value.length <= 0 &&
                tables.checkData == false ? (
                  <Introduce />
                ) : user?.value.loginWeb == 0 &&
                  tables.value.length <= 0 &&
                  tables.checkData == true ? (
                  <Introduce />
                ) : user?.value.loginWeb == 1 &&
                  tables.value.length <= 0 &&
                  tables.checkData == true ? (
                  (localStorage.setItem("key", JSON.stringify(["2"])),
                  (<Navigate to="/manager/table" />))
                ) : (
                  user?.value.loginWeb == 1 &&
                  tables.value.length > 0 &&
                  tables.checkData == false && <Navigate to="/tables" />
                )
              }
            />

            <Route
              path="/signin"
              element={
                userLoca !== null ? <Navigate to="/tables" /> : <Signin />
              }
            />
            <Route
              path="/signup"
              element={
                userLoca !== null ? <Navigate to="/tables" /> : <PicturesWall />
              }
            />

            <Route
              path="/tables/"
              element={
                user?.value.loginWeb == 0 ? <Navigate to="/" /> : <LayoutWeb />
              }
            />

            <Route path="/order/table-name=:name&&:id" element={<Orders />} />
            <Route
              path="/manager/"
              element={
                <PrivateData>
                  <LayoutAdmin />
                </PrivateData>
              }
            >
              {/* cate */}
              <Route path="categoris/" element={<ListCate />}></Route>
              <Route path="categoris/add" element={<AddCate />} />
              <Route path="categoris/edit=:id" element={<EditCate />} />
              {/* pro */}
              <Route path="products" element={<ListPro />} />
              <Route path="products/add" element={<AddPro />} />
              <Route path="products/edit=:id" element={<EditPro />} />

              {/* bàn */}
              <Route path="table" element={<ListTablee />} />
              <Route path="table/add" element={<AddTable />} />
              <Route path="table/edit=:id" element={<EditTable />} />
              {/* thống kê */}
              {(user?.value.loginWeb !== 0 || tables?.length > 0) && (
                <Route path="statistical" element={<ListStatistical />} />
              )}

              <Route path="account" element={<Account />} />

              <Route path="order" element={<ListOder />} />
              <Route path="setting" element={<Setting />} />
            </Route>
          </Routes>
        )
      ) : (
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<PicturesWall />} />
          <Route path="/tables/" element={<Notfound />} />

          <Route path="/order/table-name=:name&&:id" element={<Notfound />} />
          <Route path="/manager/" element={<Notfound />}>
            {/* cate */}
            <Route path="categoris/" element={<Notfound />}></Route>
            <Route path="categoris/add" element={<Notfound />} />
            <Route path="categoris/edit=:id" element={<Notfound />} />
            {/* pro */}
            <Route path="products" element={<Notfound />} />
            <Route path="products/add" element={<Notfound />} />
            <Route path="products/edit=:id" element={<Notfound />} />

            {/* bàn */}
            <Route path="table" element={<ListTablee />} />
            <Route path="table/add" element={<Notfound />} />
            <Route path="table/edit=:id" element={<Notfound />} />
            {/* thống kê */}
            <Route path="statistical" element={<Notfound />} />

            <Route path="account" element={<Notfound />} />

            <Route path="order" element={<Notfound />} />
            <Route path="setting" element={<Notfound />} />
          </Route>
        </Routes>
      )}

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
