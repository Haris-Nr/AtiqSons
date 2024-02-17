import React, { useCallback, useEffect, useState,useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { Dropdown, Badge, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotifications,
} from "../../redux/Features/Notification/notificationSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import socket from "../../redux/api/socket";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Notifi = ({ headerMobile }) => {

  const dispatch = useDispatch();
  const { notify } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.fetch);
  let userId = user?.employee?._id;
  const [unseenCount, setUnseenCount] = useState(0);
  const notificationAudioRef = useRef(null);

  const fetchInitialData = useCallback(() => {
    socket.emit("fetchNotifications", userId);
    socket.emit("unseenCount", userId);
  }, [userId]);
 

  useEffect(() => {

    fetchInitialData();

    const handleNewNotification = () => {
      fetchInitialData();
      notificationAudioRef.current?.play();
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("notifications", (notifications) => {
      dispatch(setNotifications(notifications));
    });

    socket.on("unseenCount", (count) => {
      setUnseenCount(count);
    });

    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("notifications");
      socket.off("unseenCount");
    };
    
  }, [userId, dispatch,fetchInitialData]);
  



  const handleSeenNotify =  (notificationId) => {
    socket.emit('markNotificationAsSeen', notificationId);
    fetchInitialData()
  };

  const latestNotifications = notify
  .filter(notification => !notification.seen)
  .slice(0, 3);

  const notificationItems = latestNotifications.map((notification) => [
    {
      label: (
        <Link
          to={`${notification.onClick}`}
          onClick={() => {
            handleSeenNotify(notification._id);
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex space-x-5">
              <div className="my-auto">
                {notification.image ? (
                  <Avatar src={<img src={`${baseURL}${notification.image}`} alt="avatar" />} />
                ) : (
                  <Avatar
                    icon={
                      <UserOutlined
                        className="p-[0.4rem]"
                        style={{
                          color: "purple",
                          backgroundColor: "#F8F8FB",
                          borderRadius: 40,
                        }}
                      />
                    }
                  />
                )}
              </div>
              <div>
                <span className="block font-bold">{notification.title}</span>
                <span className="block">{notification.message}</span>
                <span className="block text-gray-400 text-xs mx-1">
                  {moment(notification.createdAt).fromNow()}
                </span>
              </div>
            </div>
            <div>
              <Badge
                status="default"
                color="#6560F0"
                style={{ fontSize: "24px" }}
              />
            </div>
          </div>
        </Link>
      ),
      key: notification._id,
    },
    {
      type: "divider",
    },
  ]);

  const flattenedNotificationItems = [].concat(...notificationItems);
  return (
    <>
     <audio
        ref={notificationAudioRef}
        src="/sounds/notification.mp3"
        hidden={true}
      />
    <Dropdown
      overlayStyle={{ minWidth: headerMobile ? 316 : 400 }}
      menu={{
        items: [
          {
            label: (
              <div className="flex justify-between items-center p-3">
                <h1 className="font-bold text-xl">Notifications</h1>
              </div>
            ),
            key: "0",
          },
          {
            type: "divider",
          },
          ...flattenedNotificationItems,
          {
            label: (
              <div
              style={{ color: "#504BE4" }}
              className="text-center hover:underline p-3"
              >
                <Link to="notification">See All Notification</Link>
              </div>
            ),
          },
        ],
      }}
      placement={`${headerMobile ? "bottom" : "bottomRight"}`}
      trigger={["click"]}
      >
      <span onClick={(e) => e.preventDefault()}>
        <Badge
          count={unseenCount}
          overflowCount={10}
          size="small"
          style={{
            backgroundColor: "#6560F0",
            margin: "2px",
          }}
          >
          <IoNotificationsOutline className="text-2xl cursor-pointer" />
        </Badge>
      </span>
    </Dropdown>
</>
  );
};

Notifi.propTypes = {
  headerMobile: PropTypes.bool,
};

export default Notifi;
