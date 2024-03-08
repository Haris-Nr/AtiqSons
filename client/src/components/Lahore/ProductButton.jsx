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
  DatePicker,
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
import { useParams } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProductButton = ({ productId, productData: initialProductData }) => {
  const { company } = useParams();

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [currency, setCurrency] = useState("$");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [changeSelectItem, setChangeSelectItem] = useState(null);

  const { user } = useSelector((state) => state.fetch);
  const { productdata, isLoading } = useSelector((state) => state.product);
  const { employee } = user;
  const formRef = useRef(null);

  useEffect(() => {
    if (initialProductData && productId) {
      setIsEditMode(true);
      form.setFieldsValue({
        sku: initialProductData.sku,
        productName: initialProductData.productName,
        quantity: initialProductData.quantity,
        pastmonth: initialProductData.pastmonth,
        price: initialProductData.price,
        currency: initialProductData.currency,
        description: initialProductData.description,
        asin: initialProductData.asin,
        bestseller: initialProductData.bestseller,
        selectItem: initialProductData.selectItem,
        seasonalCategory: initialProductData.seasonalCategory,
        company: initialProductData.company,
        url: initialProductData.url,
        seller: initialProductData.seller,
      });
      if (initialProductData.image) {
        const imageUrl = `${baseURL}${initialProductData.image}`;
        setFileList([{ url: imageUrl, name: "Product Image", status: "done" }]);
      }
    }
  }, [initialProductData, productId, form, isEditMode]);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("currency", currency);

    if (!isEditMode) {
      formData.append("createdBy", employee?._id);
      formData.append("employeeName", employee?.fullname);
    }

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
        resetFormAndCloseModal();
        dispatch(Productsbyemployee({ productDataId: employee?._id, company }));
        dispatch(resetProductState());
      });
    }
  };

  useEffect(() => {
    if (productdata.success) {
      message.success(productdata.message);
      resetFormAndCloseModal();
      setConfirmLoading(false);
      dispatch(Productsbyemployee({ productDataId: employee?._id, company }));
      dispatch(resetProductState());
    } else if (productdata.success === false) {
      message.error(productdata.message);
      setConfirmLoading(false);
    }
  }, [productdata, dispatch, employee, company]);

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
        if (isLoading) {
          resetFormAndCloseModal();
        }
      })

      .catch((errorInfo) => {
        message.error(errorInfo);
      });
    dispatch(Productsbyemployee({ productDataId: employee?._id, company }));
  };

  const handleCancel = () => {
    resetFormAndCloseModal();
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  const items = [
    {
      value: "priority",
      label: "priority Item",
    },
    {
      value: "seasonal",
      label: "Seasonal Item",
    },
    {
      value: "holding",
      label: "Holding Item",
    },
    {
      value: "tracking",
      label: "For Tracking Item",
    },
  ];

  const companyOptions =
    company === "amazon"
      ? [{ value: "amazon", label: "Amazon" }]
      : company === "noon"
      ? [{ value: "noon", label: "Noon" }]
      : [];

  const seasonalCategory = [
    {
      value: "winter",
      label: "Winter",
    },
    {
      value: "summer",
      label: "Summer",
    },
    {
      value: "ramzan",
      label: "Ramza",
    },
    {
      value: "halloween",
      label: "Halloween",
    },
    {
      value: "christmas",
      label: "Christmas",
    },
    {
      value: "diwali",
      label: "Diwali",
    },
    {
      value: "holi",
      label: "Holi",
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

  const changeHandle = (value) => {
    setChangeSelectItem(value);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

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
        key={isEditMode ? "edit" : "add"}
        title={isEditMode ? "Edit Product" : "Add Product"}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        afterClose={() => setIsEditMode(false)}
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
            label="Sku"
            name="sku"
            rules={[{ required: true, message: "Please input the sku!" }]}
          >
            <Input />
          </Form.Item>
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
            <Select
              size="middle"
              options={items}
              onChange={(value) => changeHandle(value)}
            />
          </Form.Item>
          {(changeSelectItem === "seasonal" ||
            initialProductData?.selectItem === "seasonal") && (
            <>
              {" "}
              <Form.Item
                label="Seasonal Category"
                name="seasonalCategory"
                required="true"
                message="Please select which Category"
                hasFeedback
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
              >
                <Select size="middle" options={seasonalCategory} />
              </Form.Item>
              <Form.Item
                label="Reminder"
                name="reminder"
                required="true"
                message="Please enter reminder"
                hasFeedback
              >
                <DatePicker className="w-full" onChange={onChange} />
              </Form.Item>
            </>
          )}
          <Form.Item
            label="Company"
            name="company"
            required="true"
            message="Please select Company Name"
            hasFeedback
          >
            <Select size="middle" options={companyOptions} />
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
          <Form.Item
            label="Seller Name"
            name="seller"
            hasFeedback
            rules={[{ required: true, message: "Enter Seller Name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Image Upload" name="image" hasFeedback>
            <Upload
              listType="picture"
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
