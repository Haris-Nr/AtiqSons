import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import {
  resetUserPassword,
  resetresMessageState,
} from "../redux/Features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../redux/Features/message/messageSlice";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resMessage } = useSelector((state) => state.auth);


  useEffect(() => {
    if (resMessage.type && resMessage.message) {
      dispatch(
        showMessage({ message: resMessage.message, type: resMessage.type })
      );
      dispatch(resetresMessageState());
      if (resMessage.type === "success") {
        navigate("/");
      }
    }
  }, [resMessage, navigate, dispatch]);

  const onFinish = (values) => {
    dispatch(resetUserPassword(values));
  };

  return (
    <div>
      <h3 className="text-blue-800 font-bold text-lg  pb-5">Reset Password</h3>
      <Form
        name="resetPassword"
        onFinish={onFinish}
        size="large"
        layout="vertical"
      >
        <Form.Item
          name="email"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              type: "email",
              message: "Enter a valid email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Enter your Email"
            className="sm:text-lg"
          />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter Your Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
            className="sm:text-lg"
          />
        </Form.Item>

        <Form.Item>
            <Button
              block
              className="font-bold"
              htmlType="submit"
              shape="round"
            >
              Reset Password
            </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
