import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../redux/Features/Product/productSlice";
import { Button, Select } from 'antd';
import { Link } from "react-router-dom";

const { Option } = Select;

const Search = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { isLoading, data: products } = useSelector((state) => state.product);

  const handleSearch = useCallback(() => {
    dispatch(searchProducts(query.trim()));
  }, [dispatch, query]);

  useEffect(() => {
    if (query.trim()) {
      handleSearch();
    }
  }, [query, handleSearch]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold">Search products</h3>
      <Select
        showSearch
        size="large"
        value={query}
        placeholder="Search for products"
        defaultActiveFirstOption={false}
        suffixIcon={false}
        filterOption={false}
        onSearch={setQuery}
        onChange={setQuery}
        notFoundContent={isLoading ? 'Loading...' : 'No products found'}
        onBlur={() => setQuery('')}
        style={{ width: 300 }}
      >
        {Array.isArray(products) && products.map(product => (
          <Option key={product._id} value={product.productName}>
            <Link to={`${product._id}`}>{product.productName}</Link>
          </Option>
        ))}
      </Select>
      <Button onClick={handleSearch} disabled={isLoading || !query} type="primary" style={{ marginTop: 16 }}>
        Search
      </Button>
    </div>
  );
};

export default Search;
