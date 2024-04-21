import React, { useEffect, useContext } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  resetresMessageState,
} from "../redux/Features/auth/authSlice";
import { fetchUser } from "../redux/Features/auth/fetchSlice";
import { showMessage } from "../redux/Features/message/messageSlice";
import { TimerContext } from "../contexts/TimerContext";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resMessage } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.fetch);

  const { handleClockIn, handleClockOut } = useContext(TimerContext);

  const onFinish = (values) => {
    dispatch(loginUser(values));
  };

  
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user?.employee?.dashboard) {
      handleClockIn();
      navigate(`/${user?.employee?.dashboard}`);
    } else {
      handleClockOut();
      navigate("/");
    }
  }, [user, navigate, handleClockIn, handleClockOut]);

  useEffect(() => {
    if (resMessage.type && resMessage.message) {
      dispatch(
        showMessage({ message: resMessage.message, type: resMessage.type })
      );
      dispatch(resetresMessageState());
      if (resMessage.type === "success") {
        localStorage.setItem("token", resMessage.token);
        if (user?.employee?.dashboard) {
          navigate(`/${user?.employee?.dashboard}`);
        }
      }
    }
  }, [resMessage, dispatch, navigate, user]);

  return (
    <div>
      <h3 className="text-blue-800 font-bold text-lg pb-5">
        Login to Dashboard
      </h3>
      <Form
        form={form}
        name="loginForm"
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
            { whitespace: true },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Enter your Email"
            className="text-lg"
            autoComplete="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder="Enter Your Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
            className="text-lg"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item className="text-right">
          <Link className="login-form-forgot" to="resetpassword">
            Forgot password
          </Link>
        </Form.Item>
        <Form.Item>
          <Button block className="font-bold" htmlType="submit" shape="round">
            Log In
          </Button>
        </Form.Item>
      </Form>
      Don&#39;t have an account?&nbsp;
      <Link to="/signup" className="text-blue-400 underline">
        register now!
      </Link>
    </div>
  );
};

export default Login;
