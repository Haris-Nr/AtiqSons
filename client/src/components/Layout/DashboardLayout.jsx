import React, { useEffect, useState, useRef } from "react";
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

import global from 'global'
import * as process from "process";
global.process = process;

import SimplePeer from "simple-peer";

const DashboardLayout = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1440);
  const [headerMobile, setHeaderMobile] = useState(window.innerWidth <= 640);
  const peer = useRef(null);
  const permissionGranted = useRef(false);
  const [permissionChanged, setPermissionChanged] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const screenSharingStream = useRef(null);
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
    if (isMobile, headerMobile) {
      setCollapsed(!collapsed);
    } else {
      setCollapsed(collapsed ? false : true);
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();





  // Screen Sharing Code
  async function getScreenSharePermission() {

    try {
      permissionGranted.current = true;

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          height: 1024,
          width: 768,
          displaySurface: "monitor",

        },
        audio: true,
        preferCurrentTab: false,
        surfaceSwitching: "exclude",
        systemAudio: "include",
        monitorTypeSurface: "include",
        displaySurface: "monitor",
      });

      screenSharingStream.current = stream;

      if (stream) {


        stream.getVideoTracks()[0].addEventListener('ended', () => {
          screenSharingStream.current = null;
          permissionGranted.current = false;
          setPermissionChanged(!permissionChanged);
          setUserInteracted(false)
        })
      }

    } catch (error) {
      screenSharingStream.current = null;
      permissionGranted.current = false;
      setPermissionChanged(!permissionChanged);
      setUserInteracted(false)
    }
  }

  useEffect(() => {

    if (
      user?.employee &&
      user.employee.role === "employee" &&
      !permissionGranted.current &&
      userInteracted
    ) {
      getScreenSharePermission().then(function () {
        socket.on("screen-share-requested", function (senderId) {
          initializeEmployeePeer(senderId)
        })
      });
    }

    return () => {
      screenSharingStream.current?.getTracks().forEach((track) => track.stop());
      socket.off('screen-share-requested')
    }
  }, [user, permissionChanged, userInteracted]);




  



  async function initializeEmployeePeer(
    receiverUserId
  ) {
    console.log("InitializeEmployeePeer is called with: ", receiverUserId)

    if (peer.current && peer.current.destory) {
      peer.current.destory();
      peer.current = null;
      socket.off('peer-signal');
    }

    peer.current = new SimplePeer({
      initiator: true,
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
          // {
          //   urls: "turn:64.23.148.27:3478?transport=tcp",
          //   username: "k1fTx8LR3YDbmv9rYjLR",
          //   credential: "05mkfPfD6qtrMmNbBj6s"
          // },
          
        ],
      },
    });





    socket.on('peer-signal', (signal) => {
      console.log("SIGNAL RECEIVED: ", signal)
      peer.current.signal(signal)
    })

    peer.current.on('signal', (signal) => {
      console.log("SIGNAL SENT: ", signal)
      socket.emit('peer-signal', signal, receiverUserId);
    });


    peer.current.on('error', (err) => {
      console.log(err);
      peer.current.destroy();
      peer.current = null;
      socket.off('peer-signal');
    });

    peer.current.on('close', () => {
      peer.current?.destroy();
      peer.current = null;
      socket.off('peer-signal');
    })


    peer.current.addStream(screenSharingStream.current)
  }



  



  function getSingleFrameFromStream(stream) {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        videoElement.play();

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const base64ImageData = canvas.toDataURL('image/png');

        resolve(base64ImageData);
      };
    })
  }


  useEffect(() => {
    socket.on('screen-shot-requested', async function (senderId) {
      let imageData = null;
      if (permissionGranted.current) {
        imageData = await getSingleFrameFromStream(screenSharingStream.current)
      }

      socket.emit('send-screen-shot', {
        receiverId: senderId,
        imageData
      })
    })

    return () => {
      socket.off('screen-shot-requested')
    }
  }, [])




  return (
    <div onClick={(e)=> {
      setUserInteracted(true)
    }}>
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
    </div>
  );
};
export default DashboardLayout;
