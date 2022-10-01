import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUser } from "../features/User/UserSlice";
import { getAllTable } from "../features/TableSlice/TableSlice";
import Introduce from "../Introduce";
const PrivateLogin = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((data) => data.user);
  const tables = useSelector((data) => data.table);
  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllTable());
  }, []);
  return user?.value.loginWeb == 0 &&
    tables?.value.length <= 0 &&
    tables?.checkData == false ? (
    <Introduce />
  ) 
  // : user?.value.loginWeb == 1 &&
  //   tables?.value.length <= 0 &&
  //   tables?.checkData == true ? (
  //   (localStorage.setItem("key", JSON.stringify(["2"])),
  //   (<Navigate to="/manager/table" />))
  // ) : user?.value.loginWeb == 0 &&
  //   tables?.value.length <= 0 &&
  //   tables?.checkData == true ? (
  //   <Navigate to="/" />
  // ) 
  : (
    children
  );
};

export default PrivateLogin;
