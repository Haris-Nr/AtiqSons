import { Image, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { AllProduct, deleteDubaiProduct } from "../../redux/Features/Dubai/dubaiSlice";
import DeleteButton from "../common/DeleteButton";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const DubaiProductData = ({ id }) => {

    const dispatch = useDispatch();

    const { AllProductData,isLoading } = useSelector((state) => state.dubai);


    useEffect(() => {
        dispatch(AllProduct(id));
    }, [dispatch, id]);

    const handleDelete = (record) => {
        dispatch(deleteDubaiProduct(record));
        dispatch(AllProduct(id))
    }; 

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (_, record) => {
                const imageUrl = record.image ? `${baseURL}${record.image}` : "/no.png";
                return <Image width={100} src={imageUrl} />;
              },
        },
        {
            title: "Sku",
            dataIndex: "sku",
            key: "sku",
        },
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Reserve",
            dataIndex: "reserve",
            key: "reserve",
        },
        {
            title:"Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render:(record) => moment(record?.createdAt).format("DD/MM/YYYY")
        },
        {
            title:"Delete",
            key: "delete",
            render:(record) =>(

            <DeleteButton onConfirmDelete = {() => handleDelete(record._id)} />

            )
        }
    ];

    const dataSource = AllProductData?.data?.map((item,index) => ({
        ...item,
        key:index
    }))

  return (
    <div>
    <Table size="small" bordered dataSource={dataSource} columns={columns} loading={isLoading}  scroll={{ x: true }}/>;
</div>
  )
}

export default DubaiProductData
