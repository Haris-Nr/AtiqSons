import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, Input, Table, Space, message } from "antd";
import {
    createFullfilment,
    getAllFullfilments,
    updateFullfilment,
    deleteFullfilment,
} from "../../redux/Features/fulfilment/fullfilmentSlice";

const Fullfilment = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentFullfilment, setCurrentFullfilment] = useState(null);
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const { items, error, loading } = useSelector((state) => state.fullfilments);
    const { user } = useSelector((state) => state.fetch);
    const { employee } = user;

    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllFullfilments());
        if (error) {
            message.error(error);
        }
    }, [dispatch, error, reload]);

    const showModal = (item = null) => {
        setCurrentFullfilment(item);
        setIsModalVisible(true);
        if (item) {
            form.setFieldsValue(item);
        } else {
            form.resetFields();
        }
    };

    const handleSubmit = (values) => {
        try {
            if (currentFullfilment) {
                dispatch(
                    updateFullfilment({
                        id: currentFullfilment._id,
                        fullfilmentData: values,
                    })
                );
                message.success("Fullfilment updated successfully");
                refreshDataAndCloseModal();
            } else {
                dispatch(createFullfilment(values));
                message.success("Fullfilment created successfully");
                refreshDataAndCloseModal();
            }
            refreshDataAndCloseModal();
        } catch (error) {
            message.error("Operation failed. Please try again.");
        }
    };

    const refreshDataAndCloseModal = () => {
        dispatch(getAllFullfilments());
        setIsModalVisible(false);
        form.resetFields();
        setReload(!reload);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDelete = (id) => {
        dispatch(deleteFullfilment(id));
        message.success("Fullfilment deleted successfully");
        dispatch(getAllFullfilments());
        setReload(!reload);
    };

    const columns = [
        {
            title: "SKU",
            dataIndex: "sku",
            key: "sku",
        },
        {
            title: "ASIN",
            dataIndex: "asin",
            key: "asin",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Store",
            dataIndex: "store",
            key: "store",
        },
        {
            title: "Stock Status",
            dataIndex: "stockStatus",
            key: "stockStatus",
        },
        {
            title: "Remarks",
            dataIndex: "remarks",
            key: "remarks",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)}>Edit</Button>
                    {(employee?.role === "superadmin" || employee?.role === "admin") && (
                        <Button onClick={() => handleDelete(record._id)}>Delete</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            {(employee?.role === "superadmin" || employee?.role === "admin") && (
                <Button type="primary" onClick={() => showModal()}>
                    Add Fullfilment
                </Button>
            )}
            <Table
            size="small"
                bordered
                columns={columns}
                dataSource={items}
                rowKey="_id"
                loading={loading}
                scroll={{x:true}}
            />
            <Modal
                title={currentFullfilment ? "Edit Fullfilment" : "Add Fullfilment"}
                open={isModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="fullfilmentForm"
                    onFinish={handleSubmit}
                >
                    <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="asin" label="ASIN" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="store" label="Store" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="stockStatus"
                        label="Stock Status"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="remarks" label="Remarks">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Fullfilment;
