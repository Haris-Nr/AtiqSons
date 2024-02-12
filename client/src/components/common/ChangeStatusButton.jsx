import React from "react";
import { Button, Popconfirm } from "antd";
import PropTypes from "prop-types";

const ChangeStatusButton = ({
  Id,
  currentStatus,
  onChangeStatus,
  itemType,
}) => {

  const handleStatusChange = () => {
    let newStatus;

    if (itemType === "product") {
      newStatus =
        currentStatus === "pending"
          ? "approved"
          :currentStatus === "rejected"?"approved":"rejected";
    } else if (itemType === "employee") {
      newStatus = currentStatus === "active" ? "blocked" : "active";
    }

    onChangeStatus(Id, newStatus);
  };

  const handleCancelStatus = () =>{
    let newStatus;
    if(itemType === "product"){
      newStatus = currentStatus === "pending" ? "rejected" : currentStatus === "approved" ? "rejected":"pending";
    }
    onChangeStatus(Id, newStatus);
  }

  const popconfirmTitle =
    itemType === "product"
      ? `Are you sure to ${
          currentStatus === "approved" ? "reject" : "approve"
        } this product?`
      : itemType === "employee"
      ? `Are you sure to ${
          currentStatus === "active" ? "block" : "activate"
        } this employee?`
      : "";

      const cancelText = itemType === "product" ? currentStatus === "pending" ? "Reject":currentStatus === "approved"? "Reject":"" :"" ;
     

  const okText =
    itemType === "product"
      ? currentStatus === "pending"
        ? "Approve"
        : currentStatus === "rejected" ? "Approve":"Reject"
      : itemType === "employee"
      ? currentStatus === "active"
        ? "Block"
        : "Activate"
      : "";

      const showCancel = itemType === "product" ? currentStatus === "pending"?true:false:""

  return (
    <Popconfirm
      title={popconfirmTitle}
      onConfirm={handleStatusChange}
      onCancel={handleCancelStatus}
      okText={okText}
      cancelText={cancelText}
      showCancel={showCancel}
    >
      <Button type="primary">
        {itemType === "product" && currentStatus === "pending"
          ? "status"
          : itemType === "product" && currentStatus === "approved"
          ? "Reject"
          : itemType === "product" && currentStatus === "rejected"
          ? "Approve"
          : itemType === "employee" && currentStatus === "active"
          ? "Block"
          : itemType === "employee" && currentStatus === "blocked"
          ? "Activate"
          : ""}
      </Button>
    </Popconfirm>
  );
};

ChangeStatusButton.propTypes = {
  Id: PropTypes.string.isRequired,
  currentStatus: PropTypes.oneOf([
    "active",
    "blocked",
    "pending",
    "approved",
    "rejected",
  ]),
  onChangeStatus: PropTypes.func.isRequired,
  itemType: PropTypes.oneOf(["product", "employee"]).isRequired,
};

export default ChangeStatusButton;
