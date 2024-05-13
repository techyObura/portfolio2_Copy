import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdmin = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser;
  if (user) {
    return user.isAdmin ? <Outlet /> : <Navigate to={"/"} />;
  }
};

export default OnlyAdmin;
