import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createDubaiProduct, resetDubaiProductState } from '../../redux/Features/Dubai/dubaiSlice';

const Find = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);


    const dispatch = useDispatch();
    const { addDubaiProductData, isLoading } = useSelector((state) => state.dubai);

    const onFinish = (values) => {
        dispatch(createDubaiProduct(values));
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
                    dispatch(createDubaiProduct());
                }
            })
            .catch((errorInfo) => {
                message.error(errorInfo);
            });

    };
    const handleCancel = () => {
        resetFormAndCloseModal();
    };
    return (
        <>
            <Button
                type="primary"
                onClick={showModal}
                shape="round"
            >
                Find
            </Button>
            <Modal
                title="Find Product"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}

            >
                <Form
                    name="addProductForm"
                    ref={formRef}
                    onFinish={onFinish}>
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
                        rules={[
                            { required: true, message: "Please enter the quantity!" },
                            {
                                type: "number",
                                min: 0,
                                message: "quantity must be a non-negative number!",
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="ASIN"
                        name="asin"
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
                        label="Price"
                        name="price"
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
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            style={{ width: "100%" }}

                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default Find;