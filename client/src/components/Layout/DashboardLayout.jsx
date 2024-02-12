import React, { useEffect, useState } from "react";
import { Layout, message, theme } from "antd";
import Sidenav from "../common/Sidenav";
import Head from "../common/Head";
import CrumBread from "../common/CrumBread";
import { Outlet, useNavigate } from "react-router-dom";
import Foot from "../common/Foot";
import { useDispatch, useSelector } from "react-redux";
const { Content } = Layout;
import { fetchUser } from "../../redux/Features/auth/fetchSlice";
import socket from "../../redux/api/socket";
import { notification } from "antd";

const DashboardLayout = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1440);
  const [headerMobile, setHeaderMobile] = useState(window.innerWidth <= 640);
  const { user } = useSelector((state) => state.fetch);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {

    socket.on("newNotification", (notification) => {
      api.open({
        message: notification.title,
        description: notification.message,
        duration: 3.3,
        placement: "bottomRight",
      });
    });

    return () => {
      socket.off("newNotification");
    };
  }, [api]);

 

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      } else {
        dispatch(fetchUser());
        socket.connect();
      }
    } catch (error) {
      message.error(error.message);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1440);
      setHeaderMobile(window.innerWidth <= 640);
      if (window.innerWidth <= 1440, window.innerWidth >= 640) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = () => {
    if (isMobile,headerMobile) {
      setCollapsed(!collapsed);
    } else {
      setCollapsed(collapsed ? false : true);
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
           {contextHolder}
      <Layout hasSider>
        <Sidenav
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          user={user}
        />
        <Layout
          style={{
            marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
            transition: "margin-left 0.2s",
          }}
        >
          <Head
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
            isMobile={isMobile}
            user={user}
            headerMobile={headerMobile}
          />
          <Content
            style={{ marginTop: 64, margin: "64px 0px 0px 0px", padding: 14 }}
          >
            <CrumBread />
            <div
              style={{
                padding: 24,
                minHeight: 360,
                textAlign: "center",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Foot />
        </Layout>
      </Layout>
    </>
  );
};
export default DashboardLayout;
