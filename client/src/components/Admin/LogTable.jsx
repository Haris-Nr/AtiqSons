import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { allLogs } from "../../redux/Features/auth/logSlice";
import socket from "../../redux/api/socket";
import { showMessage } from "../../redux/Features/message/messageSlice";

const LogTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();

  const { logsRes, isLoading } = useSelector((state) => state.log);

  useEffect(() => {
    dispatch(allLogs({ currentPage, pageSize }));
    socket.connect();
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    if (logsRes.type && logsRes.message) {
      dispatch(showMessage({ message: logsRes.message, type: logsRes.type }));
    }
  }, [logsRes, dispatch]);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const calculateDuration = (loginTime, logoutTime) => {
    if (!logoutTime) return "0 hours";
    const duration = moment(logoutTime).diff(moment(loginTime), "hours", true);
    return `${duration.toFixed(2)} hours`;
  };

  const columns = [
    {
      title: "FullName",
      dataIndex: "fullname",
      key: "fullname",
      render: (text, record) => {
        return <>{record?.user_id?.fullname}</>;
      },
    },
    {
      title: "Dashboard",
      dataIndex: "dashboard",
      key: "dashboard",
      render: (text, record) => {
        return <>{record?.user_id?.dashboard}</>;
      },
    },
    {
      title: "DATE",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY"),
      key: "createdAt",
    },
    {
      title: "Login Time",
      dataIndex: "loginTime",
      render: (text) => moment(text).format("HH:mm:ss"),
      key: "loginTime",
    },
    {
      title: "Logout Time",
      dataIndex: "logoutTime",
      render: (text) => {
        return text ? moment(text).format("HH:mm:ss") : "00:00:00";
      },
      key: "logoutTime",
    },
    {
      title: "Duration",
      key: "duration",
      render: (text, record) =>
        calculateDuration(record.loginTime, record.logoutTime),
    },
  ];

  return (
    <div>
      <Table
        size="small"
        bordered
        columns={columns}
        loading={isLoading}
        rowKey={(record) => record._id}
        dataSource={logsRes?.data}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: logsRes?.totalCount,
        }}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default LogTable;
