import React, {useEffect} from 'react';
import { Table, Tag, message } from 'antd';
import { useDispatch , useSelector } from 'react-redux';
import TaskButton from './TaskButton';
import { TasksAllEmployee , deleteTaskbyId, resetDeleteState } from "../../redux/Features/Task/taskSlice";
import moment from "moment";



const AdminTaskTable = () => {
  const dispatch = useDispatch();

  const { fetchtalltaskData, deleteTaskData } = useSelector((state)=>state.task)
  

  console.log(fetchtalltaskData);
  

  useEffect(()=>{
    dispatch(TasksAllEmployee())
    
},[dispatch])

const handleDelete = (id) => {
  dispatch(deleteTaskbyId(id)).then(() => {
    dispatch(TasksAllEmployee());
  });
};

useEffect(() => {
  if (deleteTaskData.success === true) {
    message.success(deleteTaskData.message);
    dispatch(resetDeleteState());
  } else if (deleteTaskData.success === false) {
    message.error(deleteTaskData.message);
    dispatch(resetDeleteState());
  }
}, [deleteTaskData, dispatch]);

const deleteCompletedTasksAfterOneDay = () => {
  const currentDate = new Date();

  fetchtalltaskData?.data.forEach((task) => {
    if (task.status === 'complete') {
      const completionDate = new Date(task.dueDate);

      if (currentDate - completionDate > 24 * 60 * 60 * 1000) {
        handleDelete(task._id); // Delete the task
      }
    }
  });
};

useEffect(() => {
  const intervalId = setInterval(deleteCompletedTasksAfterOneDay, 24 * 60 * 60 * 1000);

  // Cleanup the interval when the component unmounts
  return () => clearInterval(intervalId);
}, [fetchtalltaskData, dispatch]);

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "fullname",
      width: 300,
    },
    {
      title: "Task",
      dataIndex: "taskDetails",
      width: 300,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      width: 50,
      render: (dueDate) => moment(dueDate).format('YYYY-MM-DD'),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 50,
      render: (_, { status }) => (
        <Tag color={`${status === "incomplete" ? "red" : "green"}`} key={status}>
            {status.toUpperCase()}
          </Tag>
      ),
    },
  ];
  
  const head = (
    <div className="flex justify-end">
    <TaskButton  />
  </div>
);

const dataSourceWithKeys = fetchtalltaskData?.data
  ? fetchtalltaskData?.data.map((item, index) => ({
      ...item,
      key: index++,
      fullname: item.employee?.fullname || '', 
    }))
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
    <div>
      <Table
       bordered
       size="middle"
      //  loading={isLoading}
        title={() => head}
        dataSource={dataSourceWithKeys}
        columns={columns}
        scroll={{ x: true }}
        pagination={{ pageSize: 8 }}
        rowClassName={rowClassName}
        />
    </div>
);
};

export default AdminTaskTable;