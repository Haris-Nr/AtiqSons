import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    InputNumber,
    Button,
    Upload,
    Select,
    DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ProductForm = ({ initialValues, onFinish, isEditMode, company, setCurrency,fileList,setFileList,productdata }) => {

    const [changeSelectItem, setChangeSelectItem] = useState(null);
    const [form] = Form.useForm();

    useEffect(()=>{
        if(productdata.type ==="success"){
            form.resetFields()
            setFileList([])
        }
    },[form,productdata.type,setFileList])

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
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
            onChange={(value)=>setCurrency(value)}
        >
            <Select.Option value="$">$</Select.Option>
            <Select.Option value="AED">AED</Select.Option>
            <Select.Option value="SAU">SAU</Select.Option>
        </Select>
    );

    const changeHandle = (value) => {
        setChangeSelectItem(value);
    };

    return (
        <div>
            <Form
                {...formItemLayout}
                form={form}
                initialValues={initialValues}
                onFinish={onFinish}
                layout="horizontal"
                className="space-y-3"
            >
                <Form.Item
                    label="Sku"
                    name = "sku"
                    hasFeedback
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
                    hasFeedback
                    rules={[{ required: true, message: "Please input the selectItem!" }]}
                >
                    <Select
                        size="middle"
                        options={items}
                        onChange={(value) => changeHandle(value)}
                    />
                </Form.Item>
                {(changeSelectItem === "seasonal" ||
                    initialValues?.selectItem === "seasonal") && (
                        <>
                            <Form.Item
                                label="Seasonal Category"
                                name="seasonalCategory"
                                hasFeedback
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 12 }}
                                rules={[{ required: true, message: "Please input the seasonalCategory!" }]}
                            >
                                <Select size="middle" options={seasonalCategory} />
                            </Form.Item>
                            <Form.Item
                                label="Reminder"
                                name="reminder"
                                hasFeedback
                                rules={[{ required: true, message: "Please input the reminder!" }]}
                            >
                                <DatePicker className="w-full" />
                            </Form.Item>
                        </>
                    )}
                <Form.Item
                    label="Company"
                    name="company"
                    hasFeedback
                    rules={[{ required: true, message: "Please input the company!" }]}
                    
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
                    <Upload listType="picture"
                    progress="line"
                    fileList={fileList}
                    onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                    maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    <Form.Item wrapperCol={{ span: 14, offset: 3 }} className="mt-3">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="font-bold"
                            block
                        >
                            {isEditMode ? "Update Product" : "Add Product"}
                        </Button>
                    </Form.Item>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProductForm;
