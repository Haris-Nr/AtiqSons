import React, { useEffect, useState } from "react";
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const InventoryForm = ({ onSubmit, order }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (order) {
      form.setFieldsValue({
        productName: order.productName,
        quantity: order.quantity,
        price: order.price,
        asin: order.asin,
        selectItem: order.selectItem,
      });
      if (order.image) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: order.image,
          },
        ]);
      }
    }
  }, [order, form]);

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
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="ASIN"
          name="asin"
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Select Item"
          name="selectItem"
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
