import React from "react";
import { Button, Popconfirm } from "antd";
import PropTypes from "prop-types";

const ChangeTrackStatusButton = ({ Id, currentStatus, onChangeStatus }) => {

  const handleTrack = () => {
    let newStatus =
      currentStatus === "pending"
        ? "tracking"
        : currentStatus === "tracking"
        ? "tracked"
        : "tracking";
    onChangeStatus(Id, newStatus);
  };

  const popconfirmTitle = `Are you sure to ${
    currentStatus === "tracking" ? "stop tracking on" : "start tracking on "
  } this product?`;

  const okText =
      currentStatus === "tracking"
        ? "stop"
        : "start";

  const buttonText =

      currentStatus === "pending"
        ? "Start Tracking"
        : currentStatus === "tracking"
        ? "Stop Tracking"
        : currentStatus === "tracked"
        ? "Start Tracking"
        : ""

  return (
    <Popconfirm
      title={popconfirmTitle}
      onConfirm={handleTrack}
      okText={okText}
      cancelText="Cancel"
    >
      <Button type="primary">{buttonText}</Button>
    </Popconfirm>
  );
};

ChangeTrackStatusButton.propTypes = {
  Id: PropTypes.string.isRequired,
  currentStatus: PropTypes.oneOf(["pending", "tracking", "tracked"]),
  onChangeStatus: PropTypes.func.isRequired,
};

export default ChangeTrackStatusButton;
