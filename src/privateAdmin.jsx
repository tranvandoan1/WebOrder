import { any } from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUser } from "./features/User/UserSlice";
const Privateadmin = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((data) => data.user.value);
  useEffect(() => {
    dispatch(getUser());
  }, []);
  return Object.keys(user)?.length <= 0 ? children : <Navigate to="/404" />;
};
Privateadmin.propTypes = {
  children: any,
};
export default Privateadmin;
