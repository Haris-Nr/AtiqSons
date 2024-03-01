import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import ProductButton from "./ProductButton";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Productsbyemployee,
  fetchProductsBySelectItem,
  setPageSize,
  setCurrentPage,
} from "../../redux/Features/Product/productSlice";
import Highlighter from "react-highlight-words";
import ProductSearch from "../common/ProductSearch";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const LahoreProductTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectItemValue,company } = useParams();

  const {
    user: { employee },
  } = useSelector((state) => state.fetch);
  const [productsList, setProductsList] = useState([]);

  const {
    fetchProductData,
    selectItemProducts,
    isLoading,
    totalItems,
    currentPage,
    pageSize,
    search,
  } = useSelector((state) => state.product);

  useEffect(() => {
    if (!selectItemValue) {
      if (employee?._id && company) {
        dispatch(Productsbyemployee({ productDataId: employee?._id, company }));
      }
    } else {
      dispatch(fetchProductsBySelectItem(selectItemValue));
    }
  }, [dispatch, employee, currentPage, pageSize, search, selectItemValue,company]);

  useEffect(() => {
    if (selectItemValue) {
      setProductsList(selectItemProducts);
    } else {
      setProductsList(fetchProductData);
    }
  }, [fetchProductData, selectItemProducts, selectItemValue]);


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

  if (selectItemValue) {
    columns.push({
      title: "Employee Name",
      dataIndex: "seller",
      key: "seller",
      render: (text) => renderColumnWithHighlight(text),
    },
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
        navigate(`/lahore/lahoreproducttable/${company}/${record._id}`);
      },
    };
  };

  const heading = (
    <div className="flex justify-between">
      <ProductSearch />
      {!selectItemValue && <ProductButton />}
    </div>
  );

  const dataSourceWithKeys = productsList
    ? productsList
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
          showQuickJumper: true,
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
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
