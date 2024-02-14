import { Table, Tag, Image, Space,} from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import Search from "antd/es/input/Search";
import {
  DubaiProduct,
} from "../../redux/Features/Product/productSlice";
import { Link } from "react-router-dom";
import Find from "./Find";

const DubaiProductTable = () => {

  const dispatch = useDispatch();

  const { dubaiProductData, isLoading } =
    useSelector((state) => state.product);

  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const renderColumnWithHighlight = (text) => (
    <Highlighter
      highlightStyle={{
        backgroundColor: "yellow",
        padding: 0,
      }}
      searchWords={[searchText]}
      autoEscape
      textToHighlight={text ? text.toString() : ""}
    />
  );

  useEffect(() => {
    dispatch(DubaiProduct());
  }, [dispatch]);


  const columns = [
    {
      title: "SrNo",
      key: "srNo",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      key: "image",
      title: "Thumbnail",
      dataIndex: "url",
      render: (_, record) => {
        return <Image width={100} src={record.image[0].url} />;
      },
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => {
        return (
          <Link to={`${record._id}`} key={record._id}>
            {renderColumnWithHighlight(text)}
          </Link>
        );
      },
      width: "30%",
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "quantity",
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
          renderColumnWithHighlight(text),
          (
            <Tag
              color={`${status === "pending"
                  ? "yellow"
                  : status === "rejected"
                    ? "red"
                    : "green"
                }`}
              key={status}
            >
              {status.toUpperCase()}
            </Tag>
          )
        );
      },
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
              color={`${tracking === "pending"
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
      title: "Action",
      dataIndex: "action",
      render: () => (
        <Space size="middle">
          <Find/>
        </Space>
      ),
      key: "action",
    },
  ];

  const dataSourceWithKeys = dubaiProductData.data
    ? dubaiProductData.data
      .filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
      .map((item,index) => ({
        ...item,
        key: index,
      }))
    : [];

  const head = (
    <div className="flex justify-between ">
      <Search
        ref={searchInput}
        size="medium"
        style={{ marginBottom: 2, width: "30%" }}
        onSearch={handleSearch}
        placeholder="Search"
        allowClear
      />
    </div>
  );

  return (
    <div>
      <Table
        bordered
        loading={isLoading}
        title={() => head}
        columns={columns}
        dataSource={dataSourceWithKeys}
        scroll={{ x: 1500 }}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default DubaiProductTable;
