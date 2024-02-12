import React, { useEffect } from "react";
import { Table, Image, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getIntrackingProduct} from "../../redux/Features/Product/productSlice";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const IntrackingproductTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.fetch);
    const { employee } = user;
    const {
        IntrackingProductdata,
        isLoading } = useSelector((state) => state.product);


    useEffect(() => {
        if (employee?._id) {
            dispatch(getIntrackingProduct(employee?._id));
        }
    }, [dispatch, employee]);


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
                const imageUrl = record.image ? `${baseURL}${record.image}` : "/no.png";
                return <Image width={100} src={imageUrl} />;
            },
        },
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
        },
        {
            title: "Asin No",
            dataIndex: "asin",
            key: "asin",
        },
        {
            title: "Track Progress",
            dataIndex: "tracking",
            key: "tracking",
            render: (text, { tracking }) => {
                return (
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
                            {tracking}
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
                        {status}
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


    const dataSourceWithKeys = IntrackingProductdata.data
        ? IntrackingProductdata.data
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
                columns={columns}
                dataSource={dataSourceWithKeys}
                scroll={{
                    x: true,
                }}
                onRow={onRowClick}
            />
        </div>
    );
};

export default IntrackingproductTable;
