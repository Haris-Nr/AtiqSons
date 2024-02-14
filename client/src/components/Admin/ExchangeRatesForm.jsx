import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select } from 'antd';
import currencyOptions from '../../utils/currencyOptions';
const { Option } = Select;

const ExchangeRateForm = ({ onSubmit, exchangeRate }) => {
  const [form] = Form.useForm();


  useEffect(() => {
    form.setFieldsValue({
      currency1: exchangeRate ? exchangeRate.currency1 : '',
      currency2: exchangeRate ? exchangeRate.currency2 : '',
      rate: exchangeRate ? exchangeRate.rate : '',
    });
  }, [exchangeRate, form]);


  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="exchangeRateForm"
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        label="Currency 1"
        name="currency1"
        rules={[{ required: true, message: 'Please select Currency 1!' }]}
      >
        <Select placeholder="Select Currency">
          {currencyOptions.map((currency) => (
            <Option key={currency.value} value={currency.value}>
              {currency.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Currency 2"
        name="currency2"
        rules={[{ required: true, message: 'Please select Currency 2!' }]}
      >
        <Select placeholder="Select Currency">
          {currencyOptions.map((currency) => (
            <Option key={currency.value} value={currency.value}>
              {currency.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Exchange Rate"
        name="rate"
        rules={[{ required: true, message: 'Please enter exchange rate!' }]}
      >
        <InputNumber min={0} step={0.01} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ExchangeRateForm;
