import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUser } from "../features/User/UserSlice";
import { getAllTable } from "../features/TableSlice/TableSlice";
import Introduce from "../Introduce";
const PrivateData = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((data) => data.user);
  const tables = useSelector((data) => data.table);
  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllTable());
  }, []);
  return user?.value.loginWeb == 0 ? <Navigate to="/" /> : children;
};

export default PrivateData;
