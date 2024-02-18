import React, { useEffect } from 'react';
import { Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  allLogs,
  setCurrentPage,
  setPageSize,
  deleteAllLogs
} from "../../redux/Features/auth/logSlice";
import socket from "../../redux/api/socket";

const LogTable = () => {

  const dispatch = useDispatch();

  const { allLogsData, totalItems, currentPage, pageSize,error,isLoading } = useSelector(
    (state) => state.log
  );

  useEffect(() => {
    dispatch(allLogs());
    socket.connect();

    const timer = setTimeout(() => {
      dispatch(deleteAllLogs());
    }, 32 * 24 * 60 * 60 * 1000);


    return () => {
      clearTimeout(timer);
    };


  }, [dispatch, currentPage, pageSize,error.message, error.success]);

  useEffect(() => {
    if (error.success === false) {
      message.error(error.message);
    }
  }, [error.message, error.success]);

  const handleTableChange = (pagination) => {
    dispatch(setCurrentPage(pagination.current));
    dispatch(setPageSize(pagination.pageSize));
  };

  const calculateDuration = (loginTime, logoutTime) => {
    if (!logoutTime) return "0 hours";
    const duration = moment(logoutTime).diff(moment(loginTime), 'hours', true);
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => {
        return <>{record?.user_id?.email}</>;
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
      title: 'Duration',
      key: 'duration',
      render: (text, record) => calculateDuration(record.loginTime, record.logoutTime),
    },
  ];

  

  const dataSourceWithKeys = allLogsData?.data
    ? allLogsData?.data.map((item,index) => ({ ...item, key: index }))
    : [];

  return (
    <div>
      <Table
        size="middle"
        bordered
        columns={columns}
        loading={isLoading}
        dataSource={dataSourceWithKeys}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
        }}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default LogTable;
