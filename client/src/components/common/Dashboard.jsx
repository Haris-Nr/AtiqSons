import React, { useEffect, useState } from "react";
import { UserOutlined,ShoppingOutlined } from "@ant-design/icons";
import DashboardCard from "./DashboardCard";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../redux/api/socket";
import { getEmployee } from "../../redux/Features/Employees/employeeSlice";
import { AllProduct } from "../../redux/Features/Product/productSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [userCount, setUserCount] = useState(0);
  const { user } = useSelector((state) => state.fetch);
  const { employee } = user;

  const { totalItems } = useSelector((state) => state.employee);
  const {
    totalProduct
  } = useSelector((state) => state.product);

  const getPeriodOfDay = (hour) =>
    hour >= 5 && hour < 12
      ? "morning"
      : hour >= 12 && hour < 18
      ? "afternoon"
      : "evening";

  const [periodOfDay, setPeriodOfDay] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    setPeriodOfDay(currentHour === 12 ? "noon" : getPeriodOfDay(currentHour));
    dispatch(getEmployee());
    dispatch(AllProduct());
    socket.connect();

    // Listen for user count updates
    const handleUserCountUpdate = (count) => {
      setUserCount(count);
    };

    socket.on("userCounts", handleUserCountUpdate);

    // Cleanup function to remove the listener
    return () => {
      socket.off("userCounts", handleUserCountUpdate);
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <>
      <div
        className="flex-col"
        style={{
          background: "#504BE4",
        }}
      >
        <div className="xl:flex xl:justify-between">
          <div className="p-5 flex-col text-white text-start">
            <h1 className="text-3xl font-bold mb-4">
              {`Good ${periodOfDay} `}
              {employee?.fullname.charAt(0).toUpperCase() +
                employee?.fullname.slice(1)}
            </h1>
            <div className="md:flex gap-3">
              <div className="flex justify-center gap-3">
                {employee?.dashboard === "admin" && (
                  <>
                  <DashboardCard
                    icon={
                      <UserOutlined
                      className="text-sm  md:text-2xl lg:p-4"
                      style={{
                        color: "purple",
                        backgroundColor: "#F8F8FB",
                        borderRadius: 40,
                      }}
                      />
                    }
                    title={`Employees`}
                    value={`${totalItems}/${userCount}`}
                    />
                    <DashboardCard
                  icon={
                    <ShoppingOutlined
                      className="text-sm md:text-2xl lg:p-4"
                      style={{
                        color: "blue",
                        backgroundColor: "#F8F8FB",
                        borderRadius: 40,
                      }}
                    />
                  }
                  title={"Products"}
                  value={`${totalProduct}`}
                />
                    </>
                )}
              </div>
            </div>
          </div>
          <div>
            <img src="/welcome.png" alt="wekcome.jpg" className="mx-auto" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
