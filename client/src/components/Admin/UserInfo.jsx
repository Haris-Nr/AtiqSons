import React, { useEffect, useRef, useState } from "react";
import { Badge, Descriptions, message, Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserStatus,
  deleteEmployee,
  getEmployeeDetails,
  resetDeleteState,
  resetStatusState,
} from "../../redux/Features/Employees/employeeSlice";
import { useParams } from "react-router-dom";
import moment from "moment";
import ChangeStatusButton from "../common/ChangeStatusButton";
import DeleteButton from "../common/DeleteButton";
import socket from "../../redux/api/socket";
import { useNavigate } from "react-router-dom";

import SimplePeer from "simple-peer";

const UserInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { id } = useParams();

  const peer = useRef(null);
  const remoteVideo = useRef(null);
  const [showScreenShareModal, setShowScreenShareModal] = useState(false);
  const [screenShareLoading, setScreenShareLoading] = useState(false);

  const [showScreenShotModal, setShowScreenShotModal] = useState(false);
  const [screenShotLoading, setScreenShotLoading] = useState(false);
  const [screenShotData, setScreenShotData] = useState(null);

  const { employeeDetails, deleteEmployeedata, changeStatusdata } = useSelector(
    (state) => state.employee
  );

  const { user } = useSelector((state) => state.fetch);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeDetails(id));
      socket.connect();
    }
    if (employeeDetails.success === false) {
      message.error(employeeDetails.message);
    }
  }, [dispatch, id, employeeDetails.message, employeeDetails.success]);

  const employee = employeeDetails?.employee;
  const log = employeeDetails.logs;

  const handleStatus = (id, newStatus) => {
    dispatch(changeUserStatus({ id, newStatus })).then(() => {
      dispatch(getEmployeeDetails(id));
    });
  };

  useEffect(() => {
    if (changeStatusdata.success === true) {
      message.success(changeStatusdata.message);
      dispatch(resetStatusState());
    } else if (changeStatusdata.success === false) {
      message.error(changeStatusdata.message);
      dispatch(resetStatusState());
    }
  }, [changeStatusdata, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id)).then(() => {
      navigate("..", { relative: "path" });
    });
  };

  useEffect(() => {
    if (deleteEmployeedata.success === true) {
      message.success(deleteEmployeedata.message);
      dispatch(resetDeleteState());
    } else if (deleteEmployeedata.success === false) {
      message.error(deleteEmployeedata.message);
      dispatch(resetDeleteState());
    }
  }, [deleteEmployeedata, dispatch]);

  const items = [
    {
      key: "1",
      label: "Full Name",
      children: employee?.fullname,
    },
    {
      key: "2",
      label: "Email",
      children: employee?.email,
    },
    {
      key: "3",
      label: "Mobile",
      children: employee?.mobile,
    },
    {
      key: "4",
      label: "Dashboard",
      children: employee?.dashboard,
    },
    {
      key: "5",
      label: "Role",
      children: employee?.role,
    },
    {
      key: "6",
      label: "Status",
      children: (
        <Badge
          status={employee?.status === "active" ? "purple" : "default"}
          text={employee?.status}
        />
      ),
    },
    {
      key: "7",
      label: "Created At",
      children: moment(employee?.createdAt).format("DD/MM/YYYY"),
    },
    {
      key: "8",
      label: "Action",
      children: (
        <Badge
          status={log?.action === "Login" ? "success" : "error"}
          text={log?.action}
        />
      ),
    },
    {
      key: "9",
      label: "LogStatus At",
      children: (
        <Badge
          status={log?.logStatus === "Active" ? "processing" : "error"}
          text={log?.logStatus}
        />
      ),
    },
    {
      key: "10",
      label: "See User Screen",
      children: <button onClick={handleSeeUserScreenClick}>Click Here</button>,
    },
    {
      key: "11",
      label: "Capture Screen Shot",
      children: (
        <button onClick={handleCaptureScreenShotClick}>Click Here</button>
      ),
    },
    {
      key: "12",
      label: "",
      children: null,
    },
  ];

  function isEmployeeOnline() {
    return new Promise((resolve, reject) => {
      socket.emit("is-employee-online", id, (response) => {
        resolve(response);
      });
    });
  }

  async function handleSeeUserScreenClick() {
    const isOnline = await isEmployeeOnline();

    if (!isOnline) {
      return message.error(
        "Employee is not online. Please try again some other time."
      );
    }

    setScreenShareLoading(Date.now());
    setShowScreenShareModal(true);
    await initializeAdminPeer(id);
    socket.emit("request-screen-share", user.employee._id, id);
  }

  async function initializeAdminPeer(receiverUserId) {
    console.log("InitializeAdminPeer is called with: ", receiverUserId);

    if (peer.current && peer.current.destory) {
      peer.current.destory();
      peer.current = null;
      remoteVideo.current.srcObject = null;
      socket.off("peer-signal");
    }

    peer.current = new SimplePeer({
      initiator: false,
      config: {
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:standard.relay.metered.ca:80?transport=tcp",
            username: "a06623f018bdad4479688c4f",
            credential: "vsW6WBT9dHhXZ9mk",
          },
        ],
      },
    });

    socket.on("peer-signal", (signal) => {
      console.log("SIGNAL RECEIVED: ", signal);
      peer.current.signal(signal);
    });

    peer.current.on("signal", (signal) => {
      console.log("SIGNAL SENT: ", signal);
      socket.emit("peer-signal", signal, receiverUserId);
    });

    peer.current.on("stream", (stream) => {
      remoteVideo.current.srcObject = stream;
      remoteVideo.current.play();
      remoteVideo.current.addEventListener("loadedmetadata", () => {
        setScreenShareLoading(false);
      });
    });

    peer.current.on("close", () => {
      remoteVideo.current.srcObject = null;
      peer.current?.destroy();
      peer.current = null;
      socket.off("peer-signal");
    });

    peer.current.on("error", (err) => {
      console.log(err);
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = null;
      }
      socket.off("peer-signal");
      peer.current.destroy();
      peer.current = null;
    });
  }

  function hideScreenShareModal() {
    peer.current.destroy();
    peer.current = null;
    remoteVideo.current.srcObject = null;
    socket.off("peer-signal");
    setShowScreenShareModal(false);
  }

  useEffect(() => {
    if (!!screenShareLoading) {
      setTimeout(() => {
        if (!!screenShareLoading) {
          // if still loading after 5 seconds, show error message
          message.error(
            "Screen Share request timed out. Most probable reason is that screen share is not allowed by Employee yet. Please try again."
          );
          setScreenShareLoading(false);
          setShowScreenShareModal(false);
        }
      }, parseFloat(import.meta.env.VITE_SCREEN_SHARE_TIMEOUT) * 1000);
    }
  }, [screenShareLoading]);

  async function handleCaptureScreenShotClick() {
    const isOnline = await isEmployeeOnline();

    if (!isOnline) {
      return message.error(
        "Employee is not online. Please try again some other time."
      );
    }

    setScreenShotLoading(true);
    setShowScreenShotModal(true);
    socket.emit("request-screen-shot", user.employee._id, id);
    socket.on("screen-shot-received", function ({ imageData }) {
      if (!imageData) {
        return message.error(
          "Employee has not allowed screen sharing yet. Please try again later."
        );
      }
      setScreenShotLoading(false);
      setScreenShotData(imageData);
    });
  }

  function hideScreenShotModal() {
    setScreenShotLoading(false);
    setShowScreenShotModal(false);
    setScreenShotData(null);
  }

  return (
    <>
      <Descriptions
        title="User Info"
        bordered
        items={items}
        extra={
          <div className="space-x-3">
            <ChangeStatusButton
              itemType="employee"
              Id={id}
              currentStatus={employee?.status}
              onChangeStatus={handleStatus}
            />
            <DeleteButton onConfirmDelete={() => handleDelete(id)} />
          </div>
        }
      />
      <Modal
        title="User Video"
        open={showScreenShareModal}
        onCancel={hideScreenShareModal}
        footer={null}
      >
        <Spin size="large" spinning={!!screenShareLoading} />

        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          hidden={!!screenShareLoading}
        ></video>
      </Modal>

      <Modal
        title="Screen Shot"
        open={showScreenShotModal}
        onCancel={hideScreenShotModal}
        footer={null}
      >
        <Spin size="large" spinning={screenShotLoading} />
        <img
          src={screenShotData}
          hidden={screenShotLoading}
          alt="Screen Shot"
        />
      </Modal>
    </>
  );
};
export default UserInfo;
