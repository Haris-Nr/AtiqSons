import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, Form, Input, InputNumber, message, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
    AllProduct,
    createDubaiProduct,
    resetDubaiProductState,
} from "../../redux/Features/Dubai/dubaiSlice";
import { UploadOutlined } from "@ant-design/icons";

const Find = ({ id }) => {
    const [fileList, setFileList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { user } = useSelector((state) => state.fetch);
    const { employee } = user;

    const dispatch = useDispatch();
    const { addDubaiProductData, isLoading } = useSelector(
        (state) => state.dubai
    );

    const onFinish = (values) => {
        const formData = new FormData();
        formData.append("productId", id);
        formData.append("createdBy", employee?._id);

        for (const [key, value] of Object.entries(values)) {
            if (key !== "image") {
                formData.append(key, value);
            }
        }

        if (fileList.length > 0) {
            formData.append("image", fileList[0].originFileObj);
        }

        dispatch(createDubaiProduct(formData)).then(() => {
            dispatch(AllProduct(id));
        });
    };

    useEffect(() => {
        if (addDubaiProductData.success) {
            message.success(addDubaiProductData.message);
            resetFormAndCloseModal();
            setConfirmLoading(false);
            dispatch(resetDubaiProductState());
        } else if (addDubaiProductData.success === false) {
            message.error(addDubaiProductData.message);
            setConfirmLoading(false);
        }
    }, [addDubaiProductData, dispatch]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const formRef = useRef(null);

    const resetFormAndCloseModal = () => {
        formRef?.current?.resetFields();
        setFileList([]);
        setIsModalOpen(false);
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
                    dispatch(AllProduct(id));
    };
    const handleCancel = () => {
        resetFormAndCloseModal();
    };
    return (
        <>
            <Button type="primary" onClick={showModal} shape="round">
                Find
            </Button>
            <Modal
                title="Find Product"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
            >
                <Form name="find product" ref={formRef} onFinish={onFinish}>
                    <Form.Item
                        label="Product Name"
                        name="productName"
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
                        rules={[{ required: true, message: "Please enter the quantity!" }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="SKU"
                        name="sku"
                        rules={[
                            {
                                required: true,
                                message: "Please enter sky!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Reserve"
                        name="reserve"
                        rules={[{ required: true, message: "Please enter!" }]}
                    >
                        <InputNumber
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item label="Image Upload" name="image" hasFeedback rules={[{ required: true, message: "upload image" }]}>
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
export default Find;
