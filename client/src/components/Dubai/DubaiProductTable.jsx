import { Table, Image, message } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import {
  DubaiProduct,
  setCurrentPage,
  setPageSize,
} from "../../redux/Features/Product/productSlice";
import { useNavigate } from "react-router-dom";
import ProductSearch from "../common/ProductSearch";
import socket from "../../redux/api/socket";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const DubaiProductTable = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    dubaiProductData,
    isLoading,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    search,
    error,
  } = useSelector((state) => state.product);

  const renderColumnWithHighlight = (text) => (
    <Highlighter
      highlightStyle={{
        backgroundColor: "yellow",
        padding: 0,
      }}
      searchWords={[search]}
      autoEscape
      textToHighlight={text ? text.toString() : ""}
    />
  );

  useEffect(() => {
    dispatch(DubaiProduct());
    socket.connect();
    if (error.success === false) {
      message.error(error.message);
    }
  }, [dispatch, currentPage, pageSize, search, error.success, error.message]);

  const handleTableChange = (pagination) => {
    dispatch(setCurrentPage(pagination.current));
    dispatch(setPageSize(pagination.pageSize));
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
      key: "image",
      title: "Thumbnail",
      dataIndex: "url",
      render: (_, record) => {
        const imageUrl = record.image ? `${baseURL}${record.image}` : "/no.png";
        return <Image width={100} src={imageUrl} />;
      },
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => renderColumnWithHighlight(text),
    },
  ];

  const onRowClick = (record) => {
    return {
      onClick: () => {
        navigate(record._id);
      },
    };
  };

  const dataSourceWithKeys = dubaiProductData.data
    ? dubaiProductData.data
        .filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((item, index) => ({
          ...item,
          key: index,
        }))
    : [];

  const head = (
    <div className=" flex justify-starts">
      <ProductSearch />
    </div>
  );

  return (
    <div>
      <Table
        size="large"
        bordered
        loading={isLoading}
        title={() => head}
        columns={columns}
        onRow={onRowClick}
        dataSource={dataSourceWithKeys}
        scroll={{ x: true }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showTotal: (total) => `Total ${total} items and ${totalPages} Pages`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default DubaiProductTable;
