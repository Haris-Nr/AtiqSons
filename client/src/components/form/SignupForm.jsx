import React, { useEffect } from "react";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Select, Form, Input } from "antd";
import PhoneInput from "react-phone-number-input";
import { useSelector, useDispatch } from "react-redux";
import { showMessage } from "../../redux/Features/message/messageSlice";
import { resetresMessageState } from "../../redux/Features/auth/authSlice";

const SignupForm = ({ onFinish, dashboard, role, navigate, handleCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { resMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (resMessage.type && resMessage.message) {
      dispatch(
        showMessage({ message: resMessage.message, type: resMessage.type })
      );
      dispatch(resetresMessageState());
      if (resMessage.type === "success") {
        form.resetFields();
        handleCancel && handleCancel();
        navigate && navigate("/");
      }
    }
  }, [dispatch, navigate, resMessage, form, handleCancel]);

  return (
    <div>
      <Form
        form={form}
        name="signupForm"
        onFinish={onFinish}
        size="large"
        layout="vertical"
      >
        <Form.Item
          name="fullname"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter your full name!",
            },
            { whitespace: true },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter your Full Name"
            className="text-lg"
          />
        </Form.Item>

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
            autoComplete="email"
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Enter your Email"
            className="text-lg"
          />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            autoComplete="current-password"
            placeholder="Enter Your Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
            className="sm:text-lg"
          />
        </Form.Item>

        <Form.Item
          name="mobile"
          rules={[
            {
              required: true,
              message: "Please input your phone number!",
            },
          ]}
          prefix={<LockOutlined className="site-form-item-icon" />}
          hasFeedback
        >
          <PhoneInput placeholder="Enter phone number +92..." />
        </Form.Item>
        <Form.Item
          name="dashboard"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please select Dashboard!",
            },
          ]}
        >
          <Select
            placeholder="Select a Dashboard"
            size="large"
            options={dashboard}
          />
        </Form.Item>
        {role && (
          <Form.Item
            name="role"
            required="true"
            message="Please select a role"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select Role!",
              },
            ]}
          >
            <Select placeholder="Select a role" size="large" options={role} />
          </Form.Item>
        )}
        <Form.Item>
          <Button block className="font-bold" htmlType="submit" shape="round">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignupForm;
