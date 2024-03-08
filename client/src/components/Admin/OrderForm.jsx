import { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, Upload, message } from 'antd';
import { AiOutlineUpload } from 'react-icons/ai';

const { Option } = Select;

const OrderForm = ({ onSubmit, order }) => {
  const [form] = Form.useForm();


  useEffect(() => {
    if (order) {
      form.setFieldsValue({
        sku: order.sku,
        productName: order.productName,
        quantity: order.quantity,
        status: order.status,
      });
    }
  }, [order, form]);

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };


  return (
    <Form
      form={form}
      name="orderForm"
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        label="SKU"
        name="sku"
        rules={[{ required: true, message: 'Please enter SKU!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="ASIN"
        name="asin"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Product Name"
        name="productName"
        rules={[{ required: true, message: 'Please enter product name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: 'Please enter quantity!' }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        label="EXW Price"
        name="exwPrice"
      >
        <InputNumber min={1}/>
      </Form.Item>

      <Form.Item
        label="Picture"
        name="picture"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra={!order?  "Upload an image for the product": "Upload a new image to replace the old one"}
        rules={[{ required: !order, message: 'Please upload a picture!' }]}
      >
        <Upload beforeUpload={beforeUpload} listType="picture" maxCount={1}>
          <Button icon={<AiOutlineUpload />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Please select status!' }]}
      >
        <Select>
          <Option value="PENDING">Pending</Option>
          <Option value="PROCESSING">Processing</Option>
          <Option value="IN TRANSIT">In Transit</Option>
          <Option value="DELIVERED">Delivered</Option>
          <Option value="CANCELLED">Cancelled</Option>
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;
