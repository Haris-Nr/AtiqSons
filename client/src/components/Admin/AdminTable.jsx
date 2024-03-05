import React, { useState,useEffect } from "react";
import { Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAdmin } from "../../redux/Features/Employees/employeeSlice";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import EmployeeButton from "./EmployeeButton";
import socket from "../../redux/api/socket";

const AdminTable = () => {

  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { getAdmindata, isLoading } = useSelector((state) => state.employee);
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(getAdmin());
    socket.connect();
    
    
  }, [dispatch]);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const columns = [
    {
      title: "SrNo",
      key: "srNo",
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "FullName",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Dashboard",
      dataIndex: "dashboard",
      key: "dashboard",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, { status }) => {
        return (
          <Tag color={`${status === "blocked" ? "red" : "green"}`} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "JOIN DATE",
      dataIndex: "createdAt",
      render: (data, record) => {
        return moment(record.createdAt).format("DD/MM/YYYY");
      },
      key: "createdAt",
    },
  ];

  const onRowClick = (record) => {
    return {
      onClick: () => {
        navigate(record._id);
      },
    };
  };

  const dataSourceWithKeys = getAdmindata
    ? getAdmindata
        .map((item,index) => ({
          ...item,
          key: index,
        }))
    : [];

  const heading = (
    <div className="flex justify-end">
      <EmployeeButton />
    </div>
  );

  return (
    <div>
      <Table
       loading={isLoading}
       bordered
       size="small"
        title={() => heading}
        columns={columns}
        dataSource={dataSourceWithKeys}
        scroll={{ x: true }}
        onRow={onRowClick}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default AdminTable;
