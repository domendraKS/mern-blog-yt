import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.user && currentUser.user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="sign-in" />
  );
};

export default AdminPrivateRoute;
