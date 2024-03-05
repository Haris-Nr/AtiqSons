import React, {useEffect} from 'react';
import { Table, Tag, message } from 'antd';
import { useDispatch , useSelector } from 'react-redux';
import TaskButton from './TaskButton';
import { TasksAllEmployee , deleteTaskbyId, resetDeleteState } from "../../redux/Features/Task/taskSlice";
import moment from "moment";
import socket from '../../redux/api/socket';
import { DeleteOutlined } from "@ant-design/icons";



const AdminTaskTable = () => {

  const dispatch = useDispatch();

  const { fetchtalltaskData, deleteTaskData,isLoading } = useSelector((state)=>state.task)
  

  useEffect(()=>{
    
    socket.connect();
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

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "fullname",
      render:(_,record)=>(
        record.employee.fullname
      )
    },
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
      title:"Delete",
      dataIndex:"delete",
      render:(text,record)=>(
        <DeleteOutlined onClick={()=>{
          handleDelete(record._id);
        }} />
      )
    }
  ];
  
  const head = (
    <div className="flex justify-end">
    <TaskButton  />
  </div>
);

const dataSourceWithKeys = fetchtalltaskData?.data
  ? fetchtalltaskData?.data.map((item, index) => ({
      ...item,
      key: index,
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
       size="small"
       loading={isLoading}
        title={() => head}
        dataSource={dataSourceWithKeys}
        columns={columns}
        scroll={{ x: true }}
        pagination={true}
        rowClassName={rowClassName}
        />
    </div>
);
};

export default AdminTaskTable;