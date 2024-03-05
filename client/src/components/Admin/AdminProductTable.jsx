import { Table, Tag, message,InputNumber,Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import {
  AllProduct,
  setCurrentPage,
  setPageSize,
  fetchProductsBySelectItem,
  setPriceLow,
  setPriceHigh,
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
  }, [dispatch, currentPage, pageSize, search, error.success, error.message,selectItemValue,company, priceLow,
    priceHigh,]);


  useEffect(() => {
    if(selectItemValue){
      setProductsList(selectItemProducts);
    } else{
      setProductsList(AllProductData);
    }
  }, [selectItemProducts, AllProductData, selectItemValue,company,priceLow,
    priceHigh,]);


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
        if(company){
          navigate(`/admin/productTable/${company}/${record._id}`);
        }else if(selectItemValue){
          navigate(`/admin/productTable/selectItem/${selectItemValue}/${record._id}`);
        }
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
    <div className="flex flex-col space-y-2">
      <ProductSearch />
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

  return (
    <div>
      <Table
        bordered
        size="small"
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
