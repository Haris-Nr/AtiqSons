import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { signupUser } from "../../redux/Features/auth/authSlice";
import {
  getAdmin,
  getEmployee,
} from "../../redux/Features/Employees/employeeSlice";
import socket from "../../redux/api/socket";
import { useLocation } from "react-router-dom";
import SignupForm from "../form/SignupForm";

const EmployeeButton = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const { user } = useSelector((state) => state.fetch);

  const userRole = user?.employee?.role;

  const isEmployeePage = location.pathname.includes("/employees");

  const dashboardOptions = [
    { value: "lahore", label: "Lahore" },
    { value: "dubai", label: "Dubai" },
    { value: "china", label: "China" },
  ];

  const dashboard =
    isEmployeePage || userRole !== "superadmin"
      ? dashboardOptions
      : [{ value: "admin", label: "Admin" }];

  const role =
    isEmployeePage || userRole !== "superadmin"
      ? [{ value: "employee", label: "Employee" }]
      : [{ value: "admin", label: "Admin" }];

  const onFinish = (values) => {
    dispatch(signupUser(values)).then(() => {
      if (isEmployeePage) {
        dispatch(getEmployee());
      } else {
        dispatch(getAdmin());
      }
    });
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        shape="round"
        icon={<PlusCircleOutlined />}
      >
        {isEmployeePage ? "Add New Employee" : "Add New Admin"}
      </Button>

      <Modal
        title={`${isEmployeePage ? "Add New Employee" : "Add New Admin"}`}
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <SignupForm
          onFinish={onFinish}
          dashboard={dashboard}
          role={role}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  );
};

export default EmployeeButton;
