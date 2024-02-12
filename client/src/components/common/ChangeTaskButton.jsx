import React from "react";
import { Button, Popconfirm } from "antd";
import PropTypes from "prop-types";

const ChangeTaskButton = ({ Id, currentStatus, onChangeStatus, itemType }) => {
  const handleStatus = () => {
    let newStatus;

    if (itemType === "task") {
      newStatus = currentStatus === "complete" ? "incomplete" : "complete";
    }

    onChangeStatus(Id, newStatus);
  };

  const popconfirmTitle =
    itemType === "task"
      ? `Are you sure to ${
          currentStatus === "complete" ? "incomplete" : "complete"
        } this Task?`
      : "";

  const okText =
    itemType === "task"
      ? currentStatus === "complete"
        ? "InCompleted"
        : "Completed"
      : "";

  return (
    <Popconfirm
      title={popconfirmTitle}
      onConfirm={handleStatus}
      okText={okText}
    >
      <Button disabled={currentStatus === "complete"}>
        {currentStatus === "complete" ? "Completed" : "Complete Task"}
      </Button>
    </Popconfirm>
  );
};

ChangeTaskButton.propTypes = {
  Id: PropTypes.string.isRequired,
  currentStatus: PropTypes.oneOf(["complete", "incomplete"]),
  onChangeStatus: PropTypes.func.isRequired,
  itemType: PropTypes.oneOf(["task"]).isRequired,
};

export default ChangeTaskButton;
