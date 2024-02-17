import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';

const PriceForm = ({ onSubmit, price }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (price) {
      form.setFieldsValue({
        price: price,
      });
    }
  }, [price, form]);

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="addPriceForm"
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: 'Please enter price!' }]}
      >
        <Input type="number" min={0} step="0.01" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PriceForm;
