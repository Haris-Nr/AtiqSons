import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  resetLogoutState,
} from "../../redux/Features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { message } from "antd";
import { resetFetchState } from "../../redux/Features/auth/fetchSlice";
import socket from "../../redux/api/socket";

const LogoutButton = () => {
  
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { user } = useSelector((state) => state.fetch);
  const { logoutData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (logoutData.success && logoutData.message) {
      Navigate("/");
      message.success(logoutData.message);
      dispatch(resetLogoutState());
      dispatch(resetFetchState());
    } else if (logoutData.success === false && logoutData.message) {
      message.error(logoutData.message);
      dispatch(resetLogoutState());
    }
  }, [logoutData, Navigate, dispatch]);

  const handleLogout = useCallback(() => {
    try {
      dispatch(logoutUser(user.employee._id)).then(() => {
        localStorage.removeItem("token");
        socket.disconnect();
      });
    } catch (error) {
      message.error("Logout failed", error);
    }
  }, [dispatch, user]);

  return (
    <>
      <TbLogout
        onClick={handleLogout}
        className="text-red-500 text-2xl cursor-pointer my-3"
      />
    </>
  );
};

export default LogoutButton;
