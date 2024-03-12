import { Table,message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SingleProduct, deleteTrack, getTrackingProduct } from "../../redux/Features/Product/productSlice";
import moment from "moment";
import DeleteButton from "../common/DeleteButton";
import { useParams } from 'react-router-dom';

const AdminTrackData = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);

  const { gettrackproduct, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getTrackingProduct(id));
    dispatch(SingleProduct(id));
  }, [dispatch, id, reload]);

  const handleDelete = (trackid) => {
    dispatch(deleteTrack(trackid))
      message.success("Delete Successfully");
      setReload(!reload)
      dispatch(getTrackingProduct(id))
  }

  const columns = [
    {
      title:"Date",
      dataIndex:"createdAt",
      render:(text)=>(moment(text).format("DD/MM/YYYY"))
    },
    {
      title: "Sale",
      dataIndex: "sale",
      key: "sale",
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      render: (_, record) =>(
        <DeleteButton 
        onConfirmDelete={()=>handleDelete(record._id)}
        />
      )
    },
  ];

  const dataSource = gettrackproduct?.data?.map((item, index) => ({
    ...item,
    key: index,
  }));
  return (
    <div>
      <Table
        size="middle"
        bordered
        dataSource={dataSource}
        columns={columns}
        loading={isLoading}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default AdminTrackData;
