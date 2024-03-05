import React, { useEffect, useState } from "react";
import { Table, Tag, InputNumber, Button } from "antd";
import ProductButton from "./ProductButton";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Productsbyemployee,
  fetchProductsBySelectItem,
  setPageSize,
  setCurrentPage,
  setPriceLow,
  setPriceHigh,
} from "../../redux/Features/Product/productSlice";
import Highlighter from "react-highlight-words";
import ProductSearch from "../common/ProductSearch";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const LahoreProductTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectItemValue, company } = useParams();
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
    priceLow,
    priceHigh,
  } = useSelector((state) => state.product);

  const [localPriceLow, setLocalPriceLow] = useState(priceLow);
  const [localPriceHigh, setLocalPriceHigh] = useState(priceHigh);

  const handlePriceLowChange = (value) => {
    setLocalPriceLow(value);
  };

  const handlePriceHighChange = (value) => {
    setLocalPriceHigh(value);
  };

  const applyPriceFilter = () => {
    dispatch(setPriceLow(localPriceLow));
    dispatch(setPriceHigh(localPriceHigh));
  };

  const clearPriceFilter = () => {
    // Reset local state
    setLocalPriceLow(null);
    setLocalPriceHigh(null);

    // Dispatch actions to reset global state
    dispatch(setPriceLow(null));
    dispatch(setPriceHigh(null));
  };

  useEffect(() => {
    if (!selectItemValue) {
      if (employee?._id && company) {
        dispatch(Productsbyemployee({ productDataId: employee?._id, company }));
      }
    } else {
      dispatch(fetchProductsBySelectItem(selectItemValue));
    }
  }, [
    dispatch,
    employee,
    currentPage,
    pageSize,
    search,
    selectItemValue,
    company,
    priceLow,
    priceHigh,
  ]);

  useEffect(() => {
    if (selectItemValue) {
      setProductsList(selectItemProducts);
    } else {
      setProductsList(fetchProductData);
    }
  }, [
    fetchProductData,
    selectItemProducts,
    selectItemValue,
    priceLow,
    priceHigh,
  ]);

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
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (text) => renderColumnWithHighlight(text),
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <>
          <span>
            {record.price}
            <sup> {record.currency}</sup>
          </span>
        </>
      ),
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
    columns.push(
      {
        title: "Employee Name",
        dataIndex: "employeeName",
        key: "seller",
        render: (text) => renderColumnWithHighlight(text),
      },
      {
        title: "Company Name",
        dataIndex: "company",
        key: "company",
        render: (text) => renderColumnWithHighlight(text),
      }
    );
  }

  const onRowClick = (record) => {
    return {
      onClick: () => {
        if (company) {
          navigate(`/lahore/lahoreproducttable/${company}/${record._id}`);
        } else if (selectItemValue) {
          navigate(
            `/lahore/lahoreproducttable/selectItem/${selectItemValue}/${record._id}`
          );
        }
      },
    };
  };

  const heading = (
    <div className="space-y-2">
      <div className="flex justify-between">
        <ProductSearch />
        {!selectItemValue && <ProductButton />}
      </div>
      <div className=" flex space-x-2">
        <InputNumber
          min={0}
          placeholder="Min Price"
          value={localPriceLow || ""}
          onChange={handlePriceLowChange}
        />
        <InputNumber
          min={0}
          placeholder="Max Price"
          value={localPriceHigh || ""}
          onChange={handlePriceHighChange}
        />
        <Button onClick={applyPriceFilter}>Apply</Button>
        <Button onClick={clearPriceFilter} style={{ marginLeft: "10px" }}>
          Clear
        </Button>
      </div>
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
        size="small"
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
