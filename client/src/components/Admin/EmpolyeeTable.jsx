import { Badge, Table, Tag } from "antd";
import React,{ useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployee,
} from "../../redux/Features/Employees/employeeSlice";
import moment from "moment";
import EmployeeButton from "./EmployeeButton";
import { useNavigate } from "react-router-dom";
import socket from "../../redux/api/socket";

function EmpolyeeTable() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { getEmployeedata, isLoading } =
    useSelector((state) => state.employee);

    console.log(getEmployeedata)


    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
    });

  useEffect(() => {
    dispatch(getEmployee());
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
      render:(text, record) => (
        <>
          <Badge status={`${ (record.action && record.logstatus) && !(record?.action==="Logout" && record?.logstatus === "Offline") ?  'success' : 'error'}`} text={`${record.fullname}`}  />
        </>
      )

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
            {status}
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

  const dataSourceWithKeys = getEmployeedata
    ? getEmployeedata
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
      size="middle"
        title={() => heading}
        bordered
        loading={isLoading}
        columns={columns}
        dataSource={dataSourceWithKeys}
        scroll={{
          x: true,
        }}
        onRow={onRowClick}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
}
export default EmpolyeeTable;
