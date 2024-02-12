import React from 'react'
import { useDispatch } from "react-redux";
import Search from "antd/es/input/Search";
import { setSearch } from '../../redux/Features/Product/productSlice';

const ProductSearch = () => {

    const dispatch = useDispatch();

    const handleSearch = (value) => {
        dispatch(setSearch(value));
      };

    return (
       <Search
      size="medium"
      style={{ marginBottom: 2, width: "30%" }}
      onSearch={handleSearch}
      placeholder="Search"
      allowClear
    />
  )
}

export default ProductSearch
