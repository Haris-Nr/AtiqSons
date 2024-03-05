import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
    fetchFlexes,
    createFlex,
    removeFlex,
    updateFlexEntry,
} from "../../redux/Features/flex/flexSlice";
import { useDispatch, useSelector } from "react-redux";

const Flex = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch();
    const { flexes, isLoading,totalCount } = useSelector((state) => state.flex);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchFlexes({ page: currentPage, limit: pageSize }));
    }, [dispatch, currentPage, pageSize]);

    const showModal = (record) => {
        setEditRecord(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                if (editRecord) {
                    dispatch(
                        updateFlexEntry({ id: editRecord._id, flexData: values })
                    ).then(() => {
                        message.success("Flex updated successfully!");
                    });
                } else {
                    dispatch(createFlex(values)).then(() => {
                        message.success("Flex added successfully!");
                    });
                }
                setIsModalVisible(false);
                setEditRecord(null);
                form.resetFields();
                dispatch(fetchFlexes({ page: currentPage, limit: pageSize }))
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditRecord(null);
    };

    const handleDelete = (id) => {
        dispatch(removeFlex(id)).then(() => {
            message.success("Flex deleted successfully!");
        });
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const columns = [
        {
            title: "Price In AED",
            dataIndex: "priceAed",
            key: "priceAed",
        },
        {
            title: "Cargo",
            dataIndex: "cargo",
            key: "cargo",
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
        },
        {
            title: "Rate RMB",
            dataIndex: "rateRMB",
            key: "rateRMB",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <span>
                    <Button onClick={() => showModal(record)} type="link">
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record._id)} type="link" danger>
                        Delete
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => showModal(null)}>
                Add New Flex
            </Button>
            <Table
                size="small"
                bordered
                dataSource={flexes}
                columns={columns}
                rowKey={(record) => record._id}
                loading={isLoading}
                scroll={{ x: true }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalCount,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                onChange={handleTableChange}
            />
            <Modal
                title={editRecord ? "Edit Flex" : "Add Flex"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="priceAed"
                        label="Price In AED"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="cargo" label="Cargo" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="totalAmount"
                        label="Total Amount"
                        rules={[{ required: true }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="rateRMB"
                        label="Rate RMB"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Flex;
