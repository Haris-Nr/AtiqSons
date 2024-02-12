import { Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrackingProduct } from "../../redux/Features/Product/productSlice";
import moment from "moment";

const AdminTrackData = ({ id }) => {
    const dispatch = useDispatch();

    const { gettrackproduct,isLoading  } = useSelector((state) => state.product);


    useEffect(() => {
        dispatch(getTrackingProduct(id));
    }, [dispatch, id]);

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: ({ date }) => moment(date).format("DD/MM/YYYY"),
        },
        {
            title: "Sale",
            dataIndex: "sale",
            key: "sale",
        },
    ];

    const dataSource = gettrackproduct?.data?.map((item,index) => ({
        ...item,
        key:index
    }))
    return (
        <div>
            <Table size="middle" bordered dataSource={dataSource} columns={columns} loading={isLoading}  scroll={{ x: true }} />;
        </div>
    );
};

export default AdminTrackData;
