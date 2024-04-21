import React, { useEffect, useState } from "react";
import { Badge, Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployee,
  resetgetEmployeedataState,
} from "../../redux/Features/Employees/employeeSlice";
import moment from "moment";
import EmployeeButton from "./EmployeeButton";
import { useNavigate } from "react-router-dom";
import socket from "../../redux/api/socket";
import { showMessage } from "../../redux/Features/message/messageSlice";

function EmpolyeeTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { getEmployeedata, isLoading } = useSelector((state) => state.employee);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getEmployee({ page: currentPage, limit: pageSize }));
    socket.connect();
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    if (getEmployeedata.type && getEmployeedata.message) {
      dispatch(
        showMessage({
          message: getEmployeedata.message,
          type: getEmployeedata.type,
        })
      );
      dispatch(resetgetEmployeedataState());
    }
  }, [dispatch, getEmployeedata.message, getEmployeedata.type]);

  const handleTableChange = (newPagination) => {
    setCurrentPage(newPagination.current);
    setPageSize(newPagination.pageSize);
  };

  const columns = [
    {
      title: "SrNo",
      key: "srNo",
      render: (text, record, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "FullName",
      dataIndex: "fullname",
      key: "fullname",
      render: (text, record) => (
        <>
          <Badge
            status={`${
              record.action &&
              record.logstatus &&
              !(record?.action === "Logout" && record?.logstatus === "Offline")
                ? "success"
                : "error"
            }`}
            text={`${record.fullname}`}
          />
        </>
      ),
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

  const heading = (
    <div className="flex justify-end">
      <EmployeeButton currentPage={currentPage} pageSize={pageSize} />
    </div>
  );

  return (
    <div>
      <Table
        size="small"
        title={() => heading}
        bordered
        loading={isLoading}
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={getEmployeedata.data}
        scroll={{
          x: true,
        }}
        onRow={onRowClick}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: getEmployeedata.totalEmployees,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
export default EmpolyeeTable;
