import React, { useEffect } from "react";
import { Table, Image, Tag, message } from "antd";
import ProductButton from "./ProductButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Productsbyemployee,
  setPageSize,
  setCurrentPage,
} from "../../redux/Features/Product/productSlice";
import Highlighter from "react-highlight-words";
import ProductSearch from "../common/ProductSearch";
const baseURL = import.meta.env.VITE_API_BASE_URL;


const LahoreProductTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.fetch);
  const { employee } = user;
  const {
    fetchProductData,
    isLoading,
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    search,
    error
  } = useSelector((state) => state.product);



  useEffect(() => {
    if (employee?._id) {
      dispatch(Productsbyemployee(employee?._id));
    }

    if(error.success === false) {
      message.error(error.message)
    }

  }, [dispatch, employee, currentPage, pageSize,search,error.message,error.success]);

  const handleTableChange = (pagination) => {
    dispatch(setCurrentPage(pagination.current));
    dispatch(setPageSize(pagination.pageSize));
  };




  const renderColumnWithHighlight = (text) => (
    <Highlighter
      highlightStyle={{
        backgroundColor: "#ffc069",
        padding: 0,
      }}
      searchWords={[search]}
      autoEscape
      textToHighlight={text ? text.toString() : ""}
    />
  );

  const columns = [
    {
      title: "SrNo",
      key: "srNo",
      render: (text, record, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
      className:"text-center"
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
    {
      title: "Asin No",
      dataIndex: "asin",
      key: "asin",
      render: (text) => renderColumnWithHighlight(text),
    },
    {
      title: "Track Progress",
      dataIndex: "tracking",
      key: "tracking",
      render: (text, { tracking }) => {
        return (
          renderColumnWithHighlight(text),
          (
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
              {tracking.toUpperCase()}
            </Tag>
          )
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, { status }) => (
        <>
          <Tag
            color={
              status === "pending"
                ? "yellow"
                : status === "rejected"
                ? "red"
                : "green"
            }
          >
            {renderColumnWithHighlight(status.toUpperCase())}
          </Tag>
        </>
      ),
    },
  ];

  const onRowClick = (record) => {
    return {
      onClick: () => {
        navigate(record._id);
      },
    };
  };

  const heading = (
    <div className="flex justify-between">
      <ProductSearch/>
      <ProductButton />
    </div>
  );

  const dataSourceWithKeys = fetchProductData
    ? fetchProductData
        .filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((item,index) => ({
          ...item,
          key: index,
        }))
    : [];

  return (
    <div>
      <Table
      size="middle"
        bordered
        loading={isLoading}
        title={() => heading}
        columns={columns}
        dataSource={dataSourceWithKeys}
        pagination={{
          showQuickJumper:true,
          showSizeChanger:true,
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showTotal: (total) => `Total ${total} product ${totalPages} page`,
        }}
        onChange={handleTableChange}
        scroll={{
          x: true,
        }}
        onRow={onRowClick}
      />
    </div>
  );
};

export default LahoreProductTable;
