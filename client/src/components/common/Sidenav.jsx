import React, { useEffect, useState } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { TfiControlForward } from "react-icons/tfi";
import { Button, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import {
  FaProductHunt,
  FaShoppingCart,
  FaMoneyBillAlt,
  FaLeaf,
  FaBoxOpen,
} from "react-icons/fa";
import { FaTasks, FaCog } from "react-icons/fa";
import { FaPersonShelter } from "react-icons/fa6";
import { BsCameraFill, BsPersonFill } from "react-icons/bs";
import { BiCalculator } from "react-icons/bi";
import { MdFreeBreakfast, MdOutlineProductionQuantityLimits, MdTrackChanges } from "react-icons/md";
import PropTypes from "prop-types";

const Sidenav = ({
  collapsed,
  toggleCollapsed,
  setCollapsed,
  isMobile,
  user,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState();

  useEffect(() => {
    const pathName = location.pathname;
    const updatedSelectedKeys = pathName.split("/").slice(2).join("/");
    setSelectedKeys(updatedSelectedKeys);
  }, [location.pathname]);
  const employeeDashboard = user?.employee?.dashboard;

  const items = [
    {
      label: "Dashboard",
      key: ".",
      path: "relative",
      icon: <AppstoreOutlined />,
    },

    // lahore
    employeeDashboard === "lahore" && {
      label: "Amazon Product",
      key: "lahoreproducttable/amazon",
      icon: <FaProductHunt />,
    },
    employeeDashboard === "lahore" && {
      label: "Noon Product",
      key: "lahoreproducttable/noon",
      icon: <FaProductHunt />,
    },
    employeeDashboard === "lahore" && {
      label: "Task",
      key: "task",
      icon: <FaTasks />,
    },
    employeeDashboard === "lahore" && {
      label: "InTracking",
      key: "intrackingtable",
      icon: <FaProductHunt />,
    },

    employeeDashboard === "lahore" && {
      label: "Prioty Products",
      key: "lahoreproducttable/selectItem/prioty",
      icon: <FaShoppingCart />,
    },
    employeeDashboard === "lahore" && {
      label: "Seasonal Products",
      key: "lahoreproducttable/selectItem/seasonal",
      icon: <FaLeaf />,
    },
    employeeDashboard === "lahore" && {
      label: "Holding Products",
      key: "lahoreproducttable/selectItem/holding",
      icon: <FaBoxOpen />,
    },

    // dubai
    employeeDashboard === "dubai" && {
      label: "Product",
      key: "dubaiproducttable",
      icon: <FaProductHunt />,
    },
    employeeDashboard === "dubai" && {
      label: "Task",
      key: "task",
      icon: <FaTasks />,
    },

    // china
    employeeDashboard === "china" && {
      label: "Orders",
      key: "orders",
      icon: <FaProductHunt />,
    },

    // common for all employees
    user?.employee?.role === "employee" && {
      label: "Settings",
      key: "settings",
      icon: <FaCog />,
    },

    user?.employee?.role === "employee" && {
      label: "My Breaks/Leaves",
      key: "break-leave",
      icon: <MdFreeBreakfast />,
    },

    //admin
    employeeDashboard === "admin" && {
      label: "Employee",
      key: "employees",
      icon: <BsPersonFill />,
    },
  
    employeeDashboard === "admin" && {
      label: "Amazon Products",
      key: "productTable/amazon",
      icon: <FaProductHunt />,
    },
    employeeDashboard === "admin" && {
      label: "Noon Products",
      key: "productTable/noon",
      icon: <FaProductHunt />,
    },
    employeeDashboard === "admin" && {
      label: "Tracking",
      key: "trackingProduct",
      icon:<MdTrackChanges />,
    },
    employeeDashboard === "admin" && {
      label: "Prioty Products",
      key: "productTable/selectItem/prioty",
      icon: <FaShoppingCart />,
    },
    employeeDashboard === "admin" && {
      label: "Seasonal Products",
      key: "productTable/selectItem/seasonal",
      icon: <FaLeaf />,
    },
    employeeDashboard === "admin" && {
      label: "Holding Products",
      key: "productTable/selectItem/holding",
      icon: <FaBoxOpen />,
    },
    employeeDashboard === "admin" && {
      label: "Task",
      key: "admintask",
      icon: <FaTasks />,
    },
    employeeDashboard === "admin" && {
      label: "Orders",
      key: "orders",
      icon: <FaShoppingCart />,
    },
    employeeDashboard === "admin" && {
      label: "Exchange Rates",
      key: "exchange-rates",
      icon: <FaMoneyBillAlt />,
    },
    employeeDashboard === "admin" && {
      label: "CBM Calculator",
      key: "cbm-calculator",
      icon: <BiCalculator />,
    },
    employeeDashboard === "admin" && {
      label: "Break/Leave",
      key: "break-leave",
      icon: <MdFreeBreakfast />,
    },
    employeeDashboard === "admin" && {
      label: "Screen Shots",
      key: "screenshots",
      icon: <BsCameraFill />,
    },
    employeeDashboard === "admin" && {
      label: "Stock",
      key: "stock",
      icon: <MdOutlineProductionQuantityLimits />,
    },
    employeeDashboard === "admin" && {
      label: "Logs",
      key: "logs",
      icon: <FaPersonShelter />,
    },
    employeeDashboard === "admin" &&
      user?.employee?.role === "superadmin" && {
        label: "Admin",
        key: "adminTable",
        icon: <BsPersonFill />,
      },

 
  ].filter(Boolean);

  const siderStyle = {
    overflow: "auto",
    height: "105vh",
    position: "fixed",
    left: 0,
    zIndex: 3,
    width: collapsed ? (isMobile ? 0 : 80) : 200,
  };
  if (isMobile && collapsed) {
    siderStyle.width = 0;
  }
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      style={siderStyle}
      breakpoint="lg"
      collapsedWidth={isMobile ? 0 : 80}
      onBreakpoint={(broken) => setCollapsed(broken)}
      trigger={null}
    >
      <div className="flex items-center p-5 gap-6">
        {collapsed ? (
          <div className="text-white font-bold text-3xl">
            <img src="/logo.png" alt="logo" />
          </div>
        ) : (
          <div className="text-white font-bold text-3xl justify-center flex items-center gap-2">
            <img src="/logo.png" alt="logo" />
            AtiqSons
          </div>
        )}
        {collapsed ? null : (
          <Button
            className="-mb-2"
            type="text"
            icon={
              !collapsed ? <TfiControlForward className="2xl:hidden" /> : null
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "22px", width: 64, height: 64, color: "white" }}
          />
        )}
      </div>
      <Menu
        onClick={(item) => {
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={items}
        className="custom-menu text-gray-400"
      />
    </Sider>
  );
};

Sidenav.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  toggleCollapsed: PropTypes.func.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default Sidenav;
