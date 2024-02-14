import { Table, Tag, Image, message } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import ProductButton from "../Lahore/ProductButton";
import {
  AllProduct,
  setCurrentPage,
  setPageSize,
} from "../../redux/Features/Product/productSlice";
import { useNavigate } from "react-router-dom";
import socket from "../../redux/api/socket";
import ProductSearch from "../common/ProductSearch";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const AdminProductTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    AllProductData,
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
    dispatch(AllProduct());
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
      className: "text-center",
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
      render: (text) => {
        return renderColumnWithHighlight(text);
      },
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "quantity",
      render: (text) => renderColumnWithHighlight(text),
      className: "text-center",
    },
    {
      title: "Asin No",
      dataIndex: "asin",
      key: "asin",
      render: (text) => renderColumnWithHighlight(text),
      className: "text-center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, { status }) => {
        return (
          <Tag
            color={`${
              status === "pending"
                ? "yellow"
                : status === "rejected"
                ? "red"
                : "green"
            }`}
            key={status}
          >
            {renderColumnWithHighlight(status)},
          </Tag>
        );
      },
      className: "text-center",
    },
    {
      title: "Track Progress",
      dataIndex: "tracking",
      key: "tracking",
      render: (text, { tracking }) => {
        return (
          <Tag
            color={`${
              tracking === "pending"
                ? "yellow"
                : tracking === "tracked"
                ? "purple"
                : "green"
            }`}
            key={tracking}
          >
            {renderColumnWithHighlight(tracking)}
          </Tag>
        );
      },
      className: "text-center",
    },
  ];

  const onRowClick = (record) => {
    return {
      onClick: () => {
        navigate(record._id);
      },
    };
  };

  const dataSourceWithKeys = AllProductData
    ? AllProductData.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ).map((item, index) => ({
        ...item,
        key: index,
      }))
    : [];

  const head = (
    <div className="flex justify-between ">
      <ProductSearch />
      <div className=" relative w-full px-4 max-w-full flex-grow flex-1 text-right ">
        <ProductButton />
      </div>
    </div>
  );

  return (
    <div>
      <Table
        bordered
        size="middle"
        loading={isLoading}
        title={() => head}
        columns={columns}
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
        onRow={onRowClick}
      />
    </div>
  );
};

export default AdminProductTable;
