import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductStatus, SingleProduct, TrackStatus, deleteProductbyId, resetDeleteState, resetProductStatusState, resetTrackStatusState } from "../../redux/Features/Product/productSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Image, Tag, Descriptions, message } from "antd";
import TrackProduct from "../Lahore/TrackProduct";
import socket from "../../redux/api/socket";
import moment from "moment";

import DeleteButton from "./DeleteButton";
import ChangeStatusButton from "./ChangeStatusButton";
import ChangeTrackStatusButton from "./ChangeTrackStatusButton";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const SingleProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { id } = useParams();

  const { user } = useSelector((state) => state.fetch);

  const { SingleProductData,deleteProductData,productStatusData,trackStatusData } = useSelector(
    (state) => state.product
  );
  useEffect(() => {
    if (id) {
      dispatch(SingleProduct(id));
      socket.connect();
    }
    if (SingleProductData.success === false) {
      message.error(SingleProductData.message);
    }

  }, [dispatch, id,SingleProductData.success,SingleProductData.message]);

  const product = SingleProductData?.data;

  const status = product?.status;
  const tracking = product?.tracking;
  const imageUrl = product?.image ? `${baseURL}${product.image}` : "/no.png";

    const handleDelete = (id) => {
    dispatch(deleteProductbyId(id)).then(() => {
      navigate("..", { relative: "path" });
    });
  };

   useEffect(() => {
    if (deleteProductData.success === true) {
      message.success(deleteProductData.message);
      dispatch(resetDeleteState());
    } else if (deleteProductData.success === false) {
      message.error(deleteProductData.message);
      dispatch(resetDeleteState());
    }
  }, [deleteProductData, dispatch]);

  const handleStatus = (id, newStatus) => {
    dispatch(ProductStatus({ id, newStatus })).then(() => {
      dispatch(SingleProduct(id));
    });
  };

  useEffect(() => {
    if (productStatusData.success === true) {
      message.success(productStatusData.message);
      dispatch(resetProductStatusState());
    } else if (productStatusData.success === false) {
      message.error(productStatusData.message);
      dispatch(resetProductStatusState());
    }
  }, [productStatusData, dispatch]);

    const handleTrack = (id, newStatus) => {
    dispatch(TrackStatus({ id, newStatus })).then(() => {
      dispatch(SingleProduct(id));
    });
  };

  useEffect(() => {
    if (trackStatusData.success === true) {
      message.success(trackStatusData.message);
      dispatch(resetTrackStatusState());
    } else if (trackStatusData.success === false) {
      message.error(trackStatusData.message);
      dispatch(resetTrackStatusState());
    }
  }, [trackStatusData, dispatch]);

  const items = [
    {
      key: "1",
      label: "Product Image",
      children: (
        <>
            <Image width={100} src={imageUrl} alt={product?.productName}/>
        </>
      ),
    },
    {
      key: "2",
      label: "Product Name",
      children: product?.productName,
    },
    {
      key: "3",
      label: "Price",
      children: (
        <>
          <sup>{product?.currency}</sup>
          <span>{product?.price}</span>
        </>
      ),
    },
    {
      key: "4",
      label: "Quantity",
      children: product?.quantity,
    },
    {
      key: "5",
      label: "Best Seller",
      children: product?.bestseller,
    },
    {
      key: "6",
      label: "Track Progress",
      children: (
        <Tag
          color={`${
            tracking === "pending"
              ? "yellow"
              : tracking === "tracked"
              ? "purple"
              : "green"
          }`}
        >
          {tracking}
        </Tag>
      ),
    },
    {
      key: "7",
      label: "Asin No",
      children: product?.asin,
    },
    {
      key: "8",
      label: "Past Month",
      children: product?.pastmonth,
    },
    {
      key: "9",
      label: "Status",
      children: (
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
      ),
    },
    {
      key: "10",
      label: "Seller",
      children: product?.seller
    },
    {
      key: "11",
      label: "Created At",
      children: ( moment(product?.createdAt).format("DD/MM/YYYY"))
    },
    {
      key: "12",
      label: "selectItem",
      children: product?.selectItem
    },
    {
      key: "13",
      label: "Amazon",
      children: (
        <Link to={product?.url} target="_blank" className="text-blue-500 hover:underline">
        Go to Amazon
        </Link>)
    },
    {
      key: "14",
      label: "About This Item",
      children: product?.description,
    },
  ];

  return (
    <div className="space-y-5">
      <Descriptions
        layout="horizontal"
        title="Product Description"
        bordered
        column={{
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 3,
        }}
        items={items}
        extra={
          <div className="space-x-2">
            {user?.employee?.role ==="admin" || user?.employee?.role ==="superadmin" &&
            <ChangeStatusButton
              itemType="product"
              Id={id}
              currentStatus={status}
              onChangeStatus={handleStatus}
            />}
            <DeleteButton onConfirmDelete={() => handleDelete(id)} />
            {user?.employee?.role ==="admin" || user?.employee?.role ==="superadmin" &&
           <ChangeTrackStatusButton
             itemType="product"
             Id={id}
             currentStatus={tracking}
             onChangeStatus={handleTrack}
          />
        }
          </div>
        }
      />
      {user?.employee?.dashboard === "lahore" && tracking === "tracking" && (
        <TrackProduct
          id={id}
        />
      )}
    </div>
  );
};

export default SingleProductPage;
