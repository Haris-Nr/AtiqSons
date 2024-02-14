import { message, Space, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { TasksForEmployee, changeTaskStatus, resetStatusState } from "../../redux/Features/Task/taskSlice";
import ChangeTaskButton from "./ChangeTaskButton";
import moment from "moment";

const TaskTable = () => {
    const dispatch = useDispatch()
    const { fetchtaskData, changeStatusdata } = useSelector((state)=>state.task)

    useEffect(()=>{
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
      render: (dueDate) => moment(dueDate).format('YYYY-MM-DD'),
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
          <Space size="middle">
            {/* <DeleteButton onConfirmDelete={() => handleDelete(record._id)} /> */}
            <ChangeTaskButton
              itemType="task"
              Id={record._id}
              currentStatus={record.status}
              onChangeStatus={handleStatus}
            />
          </Space>
        );
      },
      key: "action",
    },
  ];

  const dataSourceWithKeys = fetchtaskData?.data
  ? fetchtaskData?.data.map((item,index) => ({ ...item, key: index++ }))
  : [];
  console.log(fetchtaskData);

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
        columns={columns}
        dataSource={dataSourceWithKeys}
        pagination={{
          pageSize: 8,
        }}
        scroll={{
          x: 1500,
        }}
        rowClassName={rowClassName}
      />
  );
};
export default TaskTable;
