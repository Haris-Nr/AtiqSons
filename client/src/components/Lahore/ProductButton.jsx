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
import {
  UploadOutlined,
  PlusCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  Productsbyemployee,
  SingleProduct,
  addProduct,
  resetProductState,
  updateProductById,
} from "../../redux/Features/Product/productSlice";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProductButton = ({ productId, productData: initialProductData }) => {
  
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [currency, setCurrency] = useState("$");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { user } = useSelector((state) => state.fetch);
  const { productdata, isLoading } = useSelector((state) => state.product);
  const { employee } = user;
  const formRef = useRef(null);

  useEffect(() => {
    if (initialProductData && productId) {
      console.log(initialProductData)
      setIsEditMode(true);
      form.setFieldsValue({
        productName: initialProductData.productName,
        quantity: initialProductData.quantity,
        pastmonth: initialProductData.pastmonth,
        price: initialProductData.price,
        currency:initialProductData.currency,
        description: initialProductData.description,
        asin: initialProductData.asin,
        bestseller: initialProductData.bestseller,
        selectItem: initialProductData.selectItem,
        url: initialProductData.url,
        seller:initialProductData.seller,
        createdBy:initialProductData.createdBy
      });
      if (initialProductData.image) {
        const imageUrl = `${baseURL}${initialProductData.image}`;
        setFileList([{ url: imageUrl, name: "Product Image", status: "done" }]);
      }
    }
  }, [initialProductData, productId, form]);

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

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    if (isEditMode) {
      dispatch(
        updateProductById({ id: productId, updatedProductData: formData })
      ).then(() => {
        message.success("Product updated successfully");
        resetFormAndCloseModal();
        dispatch(SingleProduct(productId));
      });
    } else {
      dispatch(addProduct(formData)).then(() => {
        dispatch(Productsbyemployee(employee?._id));
      });
    }
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
    setIsEditMode(false);
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
      <Select.Option value="$">$</Select.Option>
      <Select.Option value="AED">AED</Select.Option>
      <Select.Option value="SAU">SAU</Select.Option>
    </Select>
  );

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        icon={isEditMode ? <EditOutlined /> : <PlusCircleOutlined />}
      >
        {isEditMode ? "Edit Product" : "Add New Product"}
      </Button>

      <Modal
        title={isEditMode ? "Edit Product" : "Add Product"}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
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
