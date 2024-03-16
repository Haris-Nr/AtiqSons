import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  resetresMessageState,
} from "../../redux/Features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { resetFetchState } from "../../redux/Features/auth/fetchSlice";
import socket from "../../redux/api/socket";
import { TimerContext } from "../../contexts/TimerContext";
import { showMessage } from "../../redux/Features/message/messageSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleClockOut } = useContext(TimerContext);
  const { user } = useSelector((state) => state.fetch);
  const { resMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (resMessage.type && resMessage.message) {
      dispatch(
        showMessage({ message: resMessage.message, type: resMessage.type })
      );
      dispatch(resetresMessageState());
      if (resMessage.type === "success") {
        localStorage.removeItem("token");
        handleClockOut();
        socket.disconnect();
        navigate("/");
        dispatch(resetFetchState());
      }
    }
  }, [resMessage, navigate, dispatch, handleClockOut]);

  const handleLogout = () => {
    dispatch(logoutUser(user.employee._id));
  };

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
