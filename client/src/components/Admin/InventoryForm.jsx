import React, { useState } from "react";
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const InventoryForm = ({ onSubmit, order }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = (values) => {

    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (key !== "image") {
        formData.append(key, value);
      }
    }

    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    }

    onSubmit(formData);
    form.resetFields();
    setFileList([]);
  };

  return (
    <div>
      <Form
        form={form}
        name="stockForm"
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="Product Name"
          name="productName"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter Product Name!",
            },
            {
              type: "text",
              message: "Enter a Valid Product Name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          hasFeedback
          rules={[{ required: true, message: "Please enter the quantity!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          hasFeedback
          rules={[{ required: true, message: "Please enter the price!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="ASIN"
          name="asin"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter ASIN number!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Select Item"
          name="selectItem"
          required="true"
          message="Please select which item"
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item label="Image Upload" name="image" hasFeedback>
            <Upload
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </Form>
    </div>
  );
};

export default InventoryForm;
