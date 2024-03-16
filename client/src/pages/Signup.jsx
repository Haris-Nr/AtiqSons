import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/Features/auth/authSlice";
import SignupForm from "../components/form/SignupForm";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    dispatch(signupUser(values));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const dashboard = [
    {
      value: "lahore",
      label: "Lahore",
    },
    {
      value: "dubai",
      label: "Dubai",
    },
    {
      value: "china",
      label: "China",
    },
  ];

  return (
    <div>
      <h3 className="text-blue-800 font-bold text-lg ">Sign Up</h3>
      <SignupForm
        onFinish={onFinish}
        dashboard={dashboard}
        navigate={navigate}
      />
      Already have an account?&nbsp;
      <Link to="/" className="text-blue-400 underline">
        Login
      </Link>
    </div>
  );
};

export default Signup;
