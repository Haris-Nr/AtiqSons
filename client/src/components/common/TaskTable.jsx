import { message, Table, Tag } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { TasksForEmployee, changeTaskStatus, resetStatusState } from "../../redux/Features/Task/taskSlice";
import ChangeTaskButton from "./ChangeTaskButton";
import moment from "moment";
import socket from "../../redux/api/socket";

const TaskTable = () => {
    const dispatch = useDispatch()
    const { fetchtaskData, changeStatusdata } = useSelector((state)=>state.task)

    useEffect(()=>{
      socket.connect();
        dispatch(TasksForEmployee())
    },[dispatch])

    const handleStatus = (id, newStatus) => {
      dispatch(changeTaskStatus({ id, newStatus })).then(() => {
        dispatch(TasksForEmployee());
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
      title: "Due Date",
      dataIndex: "dueDate",
      render: (dueDate) => moment(dueDate).format('DD/MM/YYYY'),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, { status }) => (
        <Tag color={`${status === "incomplete" ? "red" : "green"}`} key={status}>
            {status.toUpperCase()}
          </Tag>
      ),
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
    },
  ];

  const dataSourceWithKeys = fetchtaskData?.data
  ? fetchtaskData?.data.map((item,index) => ({ ...item, key: index }))
  : [];

  const rowClassName = (record) => {
    const isIncomplete = record.status.toLowerCase() !== 'complete';
    const hasDueDate = record.dueDate !== null && record.dueDate !== undefined;

    if (hasDueDate && isIncomplete) {
        const dueDate = new Date(record.dueDate);
        const currentDate = new Date();

        if (dueDate < currentDate) {
            return 'red-background'; 
        }
    }

    return '';
};

  return (
      <Table
      size="middle"
      bordered
        columns={columns}
        dataSource={dataSourceWithKeys}
        pagination={true}
        scroll={{
          x: true,
        }}
        rowClassName={rowClassName}
      />
  );
};
export default TaskTable;
