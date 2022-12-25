import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUser } from "../features/User/UserSlice";
import { getAllTable } from "../features/TableSlice/TableSlice";
const PrivateData = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((data) => data.user);
  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllTable());
  }, []);
  return user?.value.count == 0 ? <Navigate to="/" /> : children;
};

export default PrivateData;
