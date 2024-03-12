import React, { useEffect, useState } from "react";
import { Button, Modal, Form, InputNumber, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  SingleProduct,
  TrackingProduct,
  deleteTrack,
  getTrackingProduct,
} from "../../redux/Features/Product/productSlice";
import moment from "moment";
import DeleteButton from "../common/DeleteButton";
import { useParams } from "react-router-dom";

const TrackProduct = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const { gettrackproduct } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getTrackingProduct(id));
    dispatch(SingleProduct(id));
  }, [reload, dispatch, id]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    const saleData = { ...values, productId: id };
    dispatch(TrackingProduct(saleData));
    form.resetFields();
    setIsModalOpen(false);
    setReload(!reload)
    dispatch(getTrackingProduct(id));
  };

  const handleDelete = (record) => {
    dispatch(deleteTrack(record))
    setReload(!reload)
      dispatch(getTrackingProduct(id));

  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Sale",
      dataIndex: "sale",
      key: "sale",
    },
    {
      title: "Delete",
      key: "delete",
      render: (text, record) => (
        <DeleteButton onConfirmDelete={() => handleDelete(record._id)} />
      ),
    },
  ];

  return (
    <>
      <div className="float-left">
        <Button type="primary" onClick={showModal}>
          Add Sale
        </Button>
        <Modal
          title="Track Product"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
          >
            <Form.Item label="Sale" name="sale">
              <InputNumber className="w-full" />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={gettrackproduct?.data}
        rowKey={(record) => record._id}
        scroll={{ x: true }}
      />
    </>
  );
};

export default TrackProduct;
