import { Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import {
  AllProduct,
  setCurrentPage,
  setPageSize,
  fetchProductsBySelectItem
} from "../../redux/Features/Product/productSlice";
import { useNavigate,useParams } from "react-router-dom";
import socket from "../../redux/api/socket";
import ProductSearch from "../common/ProductSearch";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const AdminProductTable = () => {



  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectItemValue,company } = useParams();
  const [productsList, setProductsList] = useState([]);
  const {
    AllProductData,
    selectItemProducts,
    isLoading,
    currentPage,
    pageSize,
    totalProduct,
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
    if (!selectItemValue) {
      dispatch(AllProduct(company));
    } else {
      dispatch(fetchProductsBySelectItem(selectItemValue));
    }
    socket.connect();
    if (error.success === false) {
      message.error(error.message);
    }
  }, [dispatch, currentPage, pageSize, search, error.success, error.message,selectItemValue,company]);


  useEffect(() => {
    if(selectItemValue){
      setProductsList(selectItemProducts);
    } else{
      setProductsList(AllProductData);
    }
  }, [selectItemProducts, AllProductData, selectItemValue,company]);


  const handleTableChange = (pagination) => {
    dispatch(setCurrentPage(pagination.current));
    dispatch(setPageSize(pagination.pageSize));
  };

  const columns = [
    {
      title: "SrNo",
      key: "srNo",
      render: (text, record, index) => {
        console.log(record)
        return (currentPage - 1) * pageSize + index + 1;
      },
      className: "text-center",
    },
    {
      key: "image",
      title: "Picture",
      dataIndex: "url",
      render: (_, record) => {
        const imageUrl = record.image ? `${baseURL}${record.image}` : "/no.png";
        return <img width={50} src={imageUrl} />;
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
      title: "Employee Name",
      dataIndex:'employeeName',
      key: "Employee Name",
      render: (text) => renderColumnWithHighlight(text),
    },
    {
      title: "Asin No",
      dataIndex: "asin",
      key: "asin",
      render: (text) => renderColumnWithHighlight(text),
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
    }
  ];

  if (selectItemValue) {
    columns.push(
    {
      title: "Company Name",
      dataIndex: "company",
      key: "company",
      render: (text) => renderColumnWithHighlight(text),
    },
    );
  }

  const onRowClick = (record) => {
    return {
      onClick: () => {
        navigate(`/admin/productTable/${company}/${record._id}`);
      },
    };
  };

  const dataSourceWithKeys = productsList
    ? productsList.filter((item) =>
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
          total: totalProduct,
        }}
        onChange={handleTableChange}
        onRow={onRowClick}
      />
    </div>
  );
};

export default AdminProductTable;
