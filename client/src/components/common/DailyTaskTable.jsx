import React, { useEffect } from "react";
import { Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../redux/api/socket";
import ChangeTaskButton from "./ChangeTaskButton";
import {
  DailyTasksEmployee,
  changeTaskStatus,
  resetStatusState,
} from "../../redux/Features/Task/taskSlice";

const DailyTaskTable = () => {
  const dispatch = useDispatch();
  const { dailytask, changeStatusdata,isLoading } = useSelector((state) => state.task);

  useEffect(() => {
    socket.connect();
    dispatch(DailyTasksEmployee());
  }, [dispatch]);

  const handleStatus = (id, newStatus) => {
    dispatch(changeTaskStatus({ id, newStatus })).then(() => {
      dispatch(DailyTasksEmployee());
    });
  };

  useEffect(() => {
    if (changeStatusdata.success === true) {
      message.success(changeStatusdata.message);
      dispatch(resetStatusState());
    } else if (changeStatusdata.success === false) {
      message.error(changeStatusdata.message);
      dispatch(resetStatusState());
    }
  }, [changeStatusdata, dispatch]);

  const columns = [
    {
      title: "Task",
      dataIndex: "taskDetails",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width:7,
    },
    {
      title: "Task Type",
      dataIndex: "tasktype",
      key: "tasktype",
      width:7,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <ChangeTaskButton
            Id={record._id}
            currentStatus={record.status}
            onChangeStatus={handleStatus}
          />
        );
      },
      key: "action",
      width:7,
    },
  ];

  return (
    <div>
      <Table
        className="w-1/2"
        loading={isLoading}
        bordered
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={dailytask.data}
        size="small"
        scroll={{x:true}}
      />
    </div>
  );
};

export default DailyTaskTable;
