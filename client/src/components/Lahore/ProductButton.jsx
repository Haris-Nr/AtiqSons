import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProductForm from "../form/ProductForm";
import {
  Productsbyemployee,
  SingleProduct,
  addProduct,
  resetProductState,
  updateProductById,
} from "../../redux/Features/Product/productSlice";
import { showMessage } from "../../redux/Features/message/messageSlice";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const ProductButton = ({ productId, initialProductData }) => {

  const { company } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState("$")
  const [fileList, setFileList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user: { employee } } = useSelector((state) => state.fetch);


  useEffect(() => {
    setIsEditMode(!!initialProductData);
    if (isEditMode && initialProductData?.image) {
      const imageUrl = `${baseURL}${initialProductData?.image}`;
      setFileList([{ url: imageUrl, name: "Product Image", status: "done" }]);
    }
  }, [initialProductData,isEditMode]);

  const { productdata } = useSelector((state) => state.product);

  const onFinish = (values) => {
    if (!isEditMode) {
      values.createdBy = employee?._id
    }
    values.currency = currency
    if (fileList.length > 0 && fileList[0].originFileObj) {
      values.image = fileList[0].originFileObj
    }


    if (!isEditMode) {
      dispatch(addProduct(values))
      dispatch(resetProductState());
    } else {
      dispatch(updateProductById({ id: productId, updatedProductData: values }))
    }

  };

  useEffect(() => {
    if (productdata.type && productdata.message) {
      dispatch(
        showMessage({ message: productdata.message, type: productdata.type })
      );
      dispatch(resetProductState());
      if (productdata.type === "success") {
        dispatch(Productsbyemployee({ company }));
        handleCancel();
      }
      if(isEditMode && productdata.type === "success"){
        dispatch(SingleProduct(productId))
        handleCancel();
      }
    }
  }, [productdata.type, productdata.message, dispatch, company,isEditMode,productId]);


  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        icon={isEditMode ? <EditOutlined /> : <PlusCircleOutlined />}
      >
        {isEditMode ? "Edit Product" : "Add New Product"}
      </Button>

      <Modal
        key={isEditMode ? "edit" : "add"}
        title={isEditMode ? "Edit Product" : "Add Product"}
        open={open}
        onCancel={handleCancel}
        afterClose={() => setIsEditMode(false)}
        footer={null}
      >
        <ProductForm
          formId="productForm"
          initialValues={isEditMode ? initialProductData: null}
          onFinish={onFinish}
          company={company}
          isEditMode={isEditMode}
          setCurrency={setCurrency}
          setFileList={setFileList}
          fileList={fileList}
          productdata={productdata}
        />
      </Modal>
    </>
  );
};

export default ProductButton;
