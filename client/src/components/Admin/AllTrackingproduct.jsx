import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AllTrackingProduct } from "../../redux/Features/Product/productSlice";
import { Image, Table, Tag} from "antd";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const AllTrackingproduct = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { isLoading, alltrackingProduct } = useSelector(
        (state) => state.product
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);

    useEffect(() => {
        dispatch(AllTrackingProduct({ page: currentPage, limit: pageSize }));
    }, [currentPage, dispatch, pageSize]);


    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
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
            title: "Picture",
            dataIndex: "url",
            render: (_, record) => {
                const imageUrl = record.image ? `${baseURL}${record.image}` : "/no.png";
                return <Image width={50} src={imageUrl} />;
            },
        },
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
        },
        {
            title: "Employee Name",
            dataIndex: "seller",
            key: "seller",
        },
        {
            title: "Asin No",
            dataIndex: "asin",
            key: "asin",
        },
        {
            title: "Company Name",
            dataIndex: "company",
            key: "company",
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

    return (
        <div>
            <Table
                size="middle"
                bordered
                loading={isLoading}
                columns={columns}
                rowKey={(record) => record._id}
                dataSource={alltrackingProduct?.trackingProducts}
                pagination={{
                    current: alltrackingProduct?.page,
                    pageSize: alltrackingProduct?.limit,
                    total: alltrackingProduct?.totaltracking,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                expandable={true}
                onChange={handleTableChange}
                scroll={{
                    x: true,
                }}
            />
        </div>
    );
};

export default AllTrackingproduct;
