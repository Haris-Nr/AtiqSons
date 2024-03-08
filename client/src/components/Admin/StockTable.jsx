import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Image,
  Button,
  message,
  Input,
  Upload,
  Form,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import {
  addStock,
  deleteStock,
  editStock,
  getStock,
  resetStockState,
  uploadStock,
} from "../../redux/Features/stock/stockSlice";
import DeleteButton from "../common/DeleteButton";
import StockForm from "./StockForm";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const StockTable = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const {
    addstockmessage,
    stockItems,
    isLoading,
    error,
    pagination,
    uploadMessage,
  } = useSelector((state) => state.stock);

  const renderColumnWithHighlight = (text) => (
    <Highlighter
      highlightStyle={{
        backgroundColor: "yellow",
        padding: 0,
      }}
      searchWords={[search]}
      autoEscape
      textToHighlight={text?.toString() || ""}
    />
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, search]);

  useEffect(() => {
    dispatch(
      getStock({
        search: search.trim(),
        page: currentPage,
        limit: pageSize,
      })
    );
  }, [dispatch, currentPage, pageSize, search, reload]);

  useEffect(() => {
    if (error.success === false) {
      message.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (addstockmessage.success === true) {
      message.success(addstockmessage.message);
      dispatch(resetStockState());
    } else if (addstockmessage.success === false) {
      message.error(addstockmessage.message);
      dispatch(resetStockState());
    }
  });

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showUploadModal = () => setIsUploadModalOpen(true);
  const handleUploadModalCancel = () => {
    setIsUploadModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const onFinish = (values) => {
    dispatch(uploadStock(values));
    form.resetFields();
    setFileList([]);
    setIsUploadModalOpen(false);
    setReload(!reload);
    dispatch(
      getStock({
        search: search.trim(),
        page: currentPage,
        limit: pageSize,
      })
    );
  };

  useEffect(() => {
    if (uploadMessage.success) {
      message.success(uploadMessage.message);
      dispatch(resetStockState());
    } else if (uploadMessage.success === false) {
      message.error(uploadMessage.message);
      dispatch(resetStockState());
    }
  }, [dispatch, uploadMessage]);

  const handleDelete = (id) => {
    dispatch(deleteStock(id)).then(() => {
      dispatch(
        getStock({
          search: search.trim(),
          page: currentPage,
          limit: pageSize,
        })
      );
    });
  };

  const handleEditButton = (record) => {
    setEditItem(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "SrNo",
      key: "srNo",
      render: (text, record, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      key: "sku",
      title: "SKU",
      dataIndex: "sku",
      render: (text) => {
        return renderColumnWithHighlight(text);
      },
    },
    {
      key: "image",
      title: "Picture",
      dataIndex: "image",
      render: (_, record) => {
        const imageUrl = record.image ? `${baseURL}${record.image}` : "/no.png";
        return <Image width={30} src={imageUrl} />;
      },
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => {
        return renderColumnWithHighlight(text);
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Asin No",
      dataIndex: "asin",
      key: "asin",
      render: (text) => renderColumnWithHighlight(text),
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Item",
      dataIndex: "selectItem",
      key: "selectItem",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <DeleteButton onConfirmDelete={() => handleDelete(record._id)} />
          <Button onClick={() => handleEditButton(record)}>Edit</Button>
        </Space>
      ),
    },
  ];

  const searchMarkup = (
    <div className="flex justify-between w-full">
      <Input
        placeholder="Search order"
        className="mt-2"
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => setReload(!reload)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            return setReload(!reload);
          }

          // if backspace and search is empty, reload
          if (e.key === "Backspace" && search === "") {
            return setReload(!reload);
          }
        }}
      ></Input>
      <Button
        type="primary"
        className="mt-2 ml-2"
        onClick={() => setReload(!reload)}
      >
        Search
      </Button>
    </div>
  );

  const HeadSection = () => (
    <div className="space-y-3">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl">Warehouse Stock</h1>
        <div className="space-x-4">
          <Button type="primary" onClick={showModal}>
            Add Stock
          </Button>
          <Button onClick={showUploadModal}>Import</Button>
        </div>
      </div>
      {searchMarkup}
    </div>
  );
  function handleCreateStockFormSubmit(values) {
    if (editItem) {
      dispatch(editStock({ id: editItem._id, stockData: values }));
    } else {
      dispatch(addStock(values));
    }
    setIsModalOpen(false);
    setReload(!reload);
    dispatch(
      getStock({
        search: search.trim(),
        page: currentPage,
        limit: pageSize,
      })
    );
    setEditItem(null);
  }

  return (
    <div>
      <Table
        bordered
        size="middle"
        rowKey={(record) => record._id}
        loading={isLoading}
        title={HeadSection}
        columns={columns}
        dataSource={stockItems}
        scroll={{ x: true }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalItems,
        }}
        onChange={handleTableChange}
      />
      <Modal
        title={editItem ? "Edit Stock" : "Add Stock"}
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setEditItem(null);
        }}
        footer={null}
      >
        <StockForm onSubmit={handleCreateStockFormSubmit} order={editItem} />
      </Modal>
      <Modal
        title="Upload Stock File"
        open={isUploadModalOpen}
        onCancel={handleUploadModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="file"
            label="Upload"
            rules={[{ required: true, message: "upload file" }]}
          >
            <Upload
            listType="text"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockTable;
