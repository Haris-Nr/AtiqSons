import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
  Modal,
  Select,
} from "antd";
import { UploadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  Productsbyemployee,
  addProduct,
  resetProductState,
} from "../../redux/Features/Product/productSlice";
import { Option } from "antd/es/mentions";

const ProductButton = () => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const [currency, setCurrency] = useState("$");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { user } = useSelector((state) => state.fetch);
  const { productdata, isLoading } = useSelector((state) => state.product);
  const { employee } = user;
  const formRef = useRef(null);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("createdBy", employee?._id);
    formData.append("seller", employee?.fullname);
    formData.append("currency", currency);

    for (const [key, value] of Object.entries(values)) {
      if (key !== "image") {
        formData.append(key, value);
      }
    }

    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    }

    dispatch(addProduct(formData)).then(() => {
      dispatch(Productsbyemployee(employee?._id));
    });
  };

  useEffect(() => {
    if (productdata.success) {
      message.success(productdata.message);
      resetFormAndCloseModal();
      setConfirmLoading(false);
      dispatch(Productsbyemployee(employee?._id));
      dispatch(resetProductState());
    } else if (productdata.success === false) {
      message.error(productdata.message);
      setConfirmLoading(false);
    }
  }, [productdata, dispatch, employee]);

  const showModal = () => {
    setOpen(true);
  };

  const resetFormAndCloseModal = () => {
    formRef?.current?.resetFields();
    setFileList([]);
    setOpen(false);
  };

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then(() => {
        formRef.current.submit();
        setConfirmLoading(true);
        if (isLoading) {
          resetFormAndCloseModal();
          setConfirmLoading(false);
        }
      })
      .catch((errorInfo) => {
        message.error(errorInfo);
      });
    dispatch(Productsbyemployee(employee?._id));
  };

  const handleCancel = () => {
    resetFormAndCloseModal();
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  const items = [
    {
      value: "prioty",
      label: "Prioty Item",
    },
    {
      value: "seasonal",
      label: "Seasonal Item",
    },
    {
      value: "holding",
      label: "Holding Item",
    },
  ];

  const selectAfter = (
    <Select
      name="currency"
      defaultValue="$"
      style={{
        width: 60,
      }}
      onChange={handleCurrencyChange}
    >
      <Option value="$">$</Option>
      <Option value="AED">AED</Option>
      <Option value="SAU">SAU</Option>
    </Select>
  );

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        shape="round"
        icon={<PlusCircleOutlined />}
      >
        Add New Product
      </Button>

      <Modal
        title="Add Product"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name="addProductForm"
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          ref={formRef}
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
            rules={[
              { required: true, message: "Please enter the quantity!" },
              {
                type: "number",
                min: 0,
                message: "quantity must be a non-negative number!",
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item
            label="Past Month"
            name="pastmonth"
            hasFeedback
            rules={[{ required: true, message: "Please enter the PastMonth" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            hasFeedback
            rules={[
              { required: true, message: "Please enter the price!" },
              {
                type: "number",
                min: 0,
                message: "Price must be a non-negative number!",
              },
            ]}
          >
            <InputNumber
              addonAfter={selectAfter}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
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
            label="Best Sellers"
            name="bestseller"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select the Best Sellers Rank!",
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
            <Select placeholder="Select a Item" size="middle" options={items} />
          </Form.Item>

          <Form.Item
            label="URL Link"
            name="url"
            hasFeedback
            rules={[
              { required: true, message: "Please input the URL link!" },
              { type: "url", message: "Please enter a valid URL!" },
            ]}
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
        </Form>
      </Modal>
    </>
  );
};

export default ProductButton;
