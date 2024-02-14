import { Button, Table, message } from "antd";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllNotify,
  deleteNotify,
  resetdeleteNotificationStatusState,
  seenNotify,
} from "../../redux/Features/Notification/notificationSlice";
import DeleteButton from "./DeleteButton";
import { Link } from "react-router-dom";
import socket from "../../redux/api/socket";


const NotifyTable = () => {
  
  const dispatch = useDispatch();
  const { deleteNotificationStatus,notify } = useSelector(
    (state) => state.notifications
  );

  const { user } = useSelector((state) => state.fetch);

  let userId = user?.employee?._id

  const fetchInitialData = useCallback(() => {
    socket.emit("fetchNotifications", userId);
    socket.emit("unseenCount", userId);
  }, [userId]);



  const handleDelete = (id) => {
    dispatch(deleteNotify(id)).then(() => {
      fetchInitialData()
    });
  };
  useEffect(() => {
    fetchInitialData();
    if (deleteNotificationStatus?.success === true) {
      message.success(deleteNotificationStatus?.message);
      dispatch(resetdeleteNotificationStatusState());
    } else if (deleteNotificationStatus?.success === false) {
      message.error(deleteNotificationStatus?.message);
      dispatch(resetdeleteNotificationStatusState());
    }
  }, [deleteNotificationStatus, dispatch,fetchInitialData]);

  const handlSeen = (id) => {
    dispatch(seenNotify(id)).then(()=>{
      fetchInitialData()
    });
    
  };

  const columns = [
    {
      title: "SrNo",
      key: "srNo",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (text, record) => {
        return (
          <Link
            to={`../${record.onClick}`} relative="path"
            onClick={() => {
              handlSeen(record._id);
            }}
          >
            {record.title}
          </Link>
        );
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "whichUser",
      dataIndex: "whichUser",
    },
    {
      title: "Seen",
      dataIndex: "seen",
      render: (text, record) => {
        return <span>{record.seen && "seen"}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <DeleteButton onConfirmDelete={() => handleDelete(record._id)} />
        );
      },
      key: "action",
    },
  ];

  const deleteALl = () =>{
    dispatch(deleteAllNotify()).then(()=>{
      fetchInitialData()
    })
  }
  
  const heading = (
    <div>
      <Button onClick={deleteALl}>
        Delete All
      </Button>
    </div>
  );

  const dataSourceWithKeys = notify
  ? notify
      .map((item,index) => ({
        ...item,
        key: index++,
      }))
  : [];

  return (
    <div>
      <Table
      size="middle"
      bordered
       title={() => heading}
        columns={columns}
        dataSource={dataSourceWithKeys}
        pagination={true}
        scroll={{
          x: true,
        }}
      />
    </div>
  );
};

export default NotifyTable;
