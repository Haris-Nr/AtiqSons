import React from "react";
import { Button, Popconfirm } from "antd";
import PropTypes from "prop-types";

const ChangeTaskButton = ({ Id, currentStatus, onChangeStatus }) => {
  const handleStatus = () => {
    let newStatus = currentStatus === "complete" ? "incomplete" : "complete";

    onChangeStatus(Id, newStatus);
  };

  const popconfirmTitle = `Are you sure to complete this Task?`;

  const okText = "Complete";

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
};

export default ChangeTaskButton;
