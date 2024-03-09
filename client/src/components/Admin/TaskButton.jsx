import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Form, Select, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee } from "../../redux/Features/Employees/employeeSlice";

import { DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  TasksAllEmployee,
  addTask,
  resettaskState,
} from "../../redux/Features/Task/taskSlice";

const dateFormat = "DD/MM/YYYY";

const TaskButton = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [type, setType] = useState(null);
  const dispatch = useDispatch();
  const { getEmployeedata } = useSelector((state) => state.employee);

  const { Addtaskdata, isLoading } = useSelector((state) => state.task);

  useEffect(() => {
    if (Addtaskdata.success) {
      message.success(Addtaskdata.message);
      resetFormAndCloseModal();
      setConfirmLoading(false);
      dispatch(resettaskState());
    } else if (Addtaskdata.success === false) {
      message.error(Addtaskdata.message);
      setConfirmLoading(false);
    }
  }, [Addtaskdata, dispatch]);

  useEffect(() => {
    if (!getEmployeedata.data) {
      dispatch(getEmployee());
    }
  }, [dispatch, getEmployeedata.data]);

  const onFinish = (values) => {
    dispatch(addTask(values)).then(()=>{
      dispatch(TasksAllEmployee())
    });
    if (Addtaskdata.success) {
      message.success(Addtaskdata.message);

    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const formRef = useRef(null);

  const resetFormAndCloseModal = () => {
    formRef.current.resetFields();
    setOpen(false);
  };

  const handleOk = () => {
    formRef.current.submit();
    if (isLoading) {
      resetFormAndCloseModal();
      setConfirmLoading(false);
    }
    dispatch(TasksAllEmployee());
  };

  const handleCancel = () => {
    resetFormAndCloseModal();
  };

  const employee = getEmployeedata?.map((emp) => ({
    value: emp._id,
    label: emp.fullname,
  }));

  const priority = [
    {
      value:"low",
      label: "Low"
    },
    {
      value:"medium",
      label:"Medium"
    },
    {
      value:"high",
      label:"High"
    }
  ]

  const tasktypes = [
    {
      value:"daily",
      label: "Daily"
    },
    {
      value:"onetime",
      label:"One Time"
    }
  ]

  const changeHandle = (value) => {
    setType(value);
  };


  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        shape="round"
        icon={<PlusCircleOutlined />}
      >
        Asign Task
      </Button>
      <Modal
        title="Create New Task"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="task_form"
          onFinish={onFinish}
          size="large"
          layout="vertical"
          ref={formRef}
          
        >
          <Form.Item
            label="Task "
            name="taskDetails"
            rules={[{ required: true, message: "Please input a task!" }]}
          >
            <TextArea />
          </Form.Item>

        

          <Form.Item
            label="Assign to"
            name="employee"
            rules={[{ required: true, message: "Please select an employee!" }]}
          >
            <Select
              placeholder="Select an employee"
              showSearch
              size="large"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={employee}
            />
          </Form.Item>

          <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please select a priorty!" }]}
          >
            <Select options={priority}/>
          </Form.Item>

          <Form.Item
          label="Task Type"
          name="tasktype"
          rules={[{ required: true, message: "Please select a type!" }]}
          >
            <Select 
            options={tasktypes}
            onChange={(value)=>{changeHandle(value)}}
            />
          </Form.Item>
              {
                type === "onetime" &&
             
          <Form.Item
            label="Deadline"
            name="dueDate"
            rules={[{ required: true, message: "Please select a deadline!" }]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
           }

        </Form>
      </Modal>
    </>
  );
};

export default TaskButton;
