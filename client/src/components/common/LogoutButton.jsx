import React, { useCallback, useContext, useEffect } from "react";
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
import { TimerContext } from "../../contexts/TimerContext";

const LogoutButton = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleClockOut } = useContext(TimerContext);
  const { user } = useSelector((state) => state.fetch);
  const { logoutData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (logoutData?.success && logoutData?.message) {
      localStorage.removeItem("token");
      handleClockOut();
      navigate("/");
      message.success(logoutData.message);
      dispatch(resetLogoutState());
      dispatch(resetFetchState());
    } else if (logoutData?.success === false && logoutData?.message) {
      message.error(logoutData.message);
      dispatch(resetLogoutState());
    }
  }, [logoutData, navigate, dispatch,handleClockOut]);

  const handleLogout = useCallback(() => {
    try {
      dispatch(logoutUser(user.employee._id)).then(() => {
        if(logoutData.success === true){
          localStorage.removeItem("token");
          handleClockOut();
          socket.disconnect();
        }
      });
    } catch (error) {
      message.error("Logout failed", error);
    }
  }, [dispatch, user,handleClockOut,logoutData.success]);

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
