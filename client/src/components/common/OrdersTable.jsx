import {
    Table,
    Tag,
    Space,
    Button,
    Modal,
    message,
    Input,
    Select,
} from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import {
    getOrders,
    createOrder,
    reOrder,
    updateOrder,
    deleteOrder,
} from '../../redux/Features/Order/orderSlice';

import {
    getExchangeRate,
    getCurrencyOptions,
} from '../../redux/Features/ExchangeRate/exchangeRateSlice';


import OrderForm from '../Admin/OrderForm';
import { defaultCurrency } from '../../utils/currencyOptions';
import ConfirmationModal from './ConfirmationModal';

const OrdersTable = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
    const [showEditOrderModal, setShowEditOrderModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reload, setReload] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);


    const {
        orders,
        isLoading,
        errorMessage
    } = useSelector((state) => state.order);

    const {
        selectedCurrencyExchangeRate,
        isLoading: isLoadingExchangeRate,
        currencyOptions,
        errorMessage: exchangeRateErrorMessage
    } = useSelector((state) => state.exchangeRate);

    const user = useSelector((state) => state.fetch.user);

    const renderColumnWithHighlight = (text) => (
        <Highlighter
            highlightStyle={{
                backgroundColor: 'yellow',
                padding: 0
            }}
            searchWords={[search]}
            autoEscape
            textToHighlight={text?.toString() || ''}
        />
    );


    useEffect(() => {
        dispatch(getCurrencyOptions());
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize, search])

    useEffect(() => {
        dispatch(getOrders({
            page: currentPage,
            pageSize,
            search: search.trim()
        }));
    }, [dispatch, currentPage, pageSize, reload]);


    useEffect(() => {
        if (errorMessage) {
            message.error(errorMessage);
        }

        if (exchangeRateErrorMessage) {
            message.error(exchangeRateErrorMessage);
        }
    }, [errorMessage, exchangeRateErrorMessage])

    useEffect(() => {
        if (selectedCurrency !== defaultCurrency) {
            dispatch(getExchangeRate({
                currency1: defaultCurrency,
                currency2: selectedCurrency
            }));
        }
    }, [dispatch, selectedCurrency]);




    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };


    function isAdmin() {
        return user.employee?.role === "admin" || user.employee?.role === "superadmin";
    }



    function currencyOptionWithDefault(currencyOptions) {
        const hasDefaultCurrency = currencyOptions.find((currency) => currency.value === defaultCurrency);

        if (!hasDefaultCurrency) {
            return [
                {
                    label: defaultCurrency,
                    value: defaultCurrency
                },
                ...currencyOptions
            ];
        } else return currencyOptions;
    }

    const currencySelect = (
        <Select
            defaultValue={selectedCurrency}

            onChange={(value) => setSelectedCurrency(value)}
        >
            {currencyOptionWithDefault(currencyOptions).map((currency) => (
                <Select.Option key={currency.value} value={currency.value}>
                    {currency.label}
                </Select.Option>
            ))}
        </Select>
    );

    const columns = [
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Picture',
            dataIndex: 'picture',
            key: 'picture',
            render: (picture) => <img
                src={import.meta.env.VITE_API_BASE_URL + picture}
                alt="Product"
                style={{ width: '50px', height: '50px' }}
            />
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
            render: (text) => renderColumnWithHighlight(text)
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: <span>Price {currencySelect}</span>,
            dataIndex: 'price',
            key: 'price',
            render: (price) => {
                if (isLoadingExchangeRate) {
                    return <span>Loading...</span>;
                }

                return (
                    <span>
                        {selectedCurrency !== defaultCurrency ? (price * selectedCurrencyExchangeRate.rate).toFixed(2) : price.toFixed(2)}
                    </span>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                return (
                    <div className={`custom-select-${status.replace(' ', '_')}`}>
                        <Select
                            defaultValue={status}
                            onChange={(value) => handleOrderStatusChangeBtnClick(value, record._id)}
                        >
                            <Option value="PENDING">Pending</Option>
                            <Option value="PROCESSING">Processing</Option>
                            <Option value="IN TRANSIT">In Transit</Option>
                            <Option value="DELIVERED">Delivered</Option>
                            <Option value="CANCELLED">Cancelled</Option>
                        </Select>
                    </div>
                );
            }
        }
    ];

    if (isAdmin()) {
        columns.push({
            title: 'Action',
            key: 'reorder',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleReOrderBtnClick(record._id)}>Re-Order</Button>
                    {/* edit and delete buttons */}
                    <Button
                        type="primary"
                        onClick={() => handleEitOrderBtnClick(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => handleDeleteOrderBtnClick(record)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        })
    }


    function handleOrderStatusChangeBtnClick(value, id) {
        const onSuccess = () => {
            message.success("Order Status Updated");
        }
        const onFail = () => {
            message.error("Order Status Update Failed");
        }

        dispatch(updateOrder({
            id,
            orderData: {
                status: value,
            },
            onSuccess,
            onFail
        }))

        setReload(!reload);
    }


    function handleEitOrderBtnClick(record) {
        setSelectedOrder(record);
        setShowEditOrderModal(true);
    }


    function hideEditOrderModal() {
        setShowEditOrderModal(false);
        setSelectedOrder(null);
    }

    function handleEditOrderFormSubmit(values) {
        const onSuccess = () => {
            message.success("Order Updated");
            setReload(!reload);
            setShowEditOrderModal(false);
        }

        const onFail = () => {
            message.error("Order Update Failed");
            setShowEditOrderModal(false);
        }

        dispatch(updateOrder({
            id: selectedOrder._id,
            orderData: values,
            onSuccess,
            onFail   
        }));
    }


    function handleDeleteOrderBtnClick(order) {
        setSelectedOrder(order);
        setShowDeleteConfirmModal(true);
    }


    function handleConfirmDeleteBtnClick(){
        const onSuccess = () => {
            message.success("Order Deleted");
            setReload(!reload);
            setShowDeleteConfirmModal(false);
        }

        const onFail = () => {
            message.error("Order Delete Failed");
            setShowDeleteConfirmModal(false);
        }

        dispatch(deleteOrder({
            id: selectedOrder._id,
            onSuccess,
            onFail
        }));
    }

    function hideDeleteConfirmModal() {
        setShowDeleteConfirmModal(false);
        setSelectedOrder(null);
    }

    const searchMarkup = <div className="flex justify-between w-full">
        <Input
            placeholder="Search order"
            className='mt-2'
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => setReload(!reload)}
            onKeyUp={(e) => {
                if (e.key === "Enter") {
                    return setReload(!reload);
                }

                // if backspace and search is empty, reload
                if (e.key === "Backspace" && search === "") {
                    return setReload(!reload);
                }
            }}
        ></Input>
        <Button
            type="primary"
            className='mt-2 ml-2'
            onClick={() => setReload(!reload)}
        >Search</Button>
    </div>

    const adminUserHeadSection = () => (
        <div>
            <div className="flex justify-between w-full">
                <h1 className="text-2xl">Orders</h1>
                <Button type="primary" onClick={handleCreateOrderBtnClick}>
                    Create Order
                </Button>
            </div>
            {searchMarkup}
        </div>
    );


    const employeeUserHeadSection = () => (
        <div>
            <h1
                className="text-2xl text-left"
            >
                Orders
            </h1>
        </div>
    );


    function getHeadSection() {
        if (isAdmin()) {
            return adminUserHeadSection();
        } else {
            return employeeUserHeadSection();
        }
    }


    function handleCreateOrderBtnClick() {
        setShowCreateOrderModal(true);
    }

    function hideCreateOrderModal() {
        setShowCreateOrderModal(false);
    }


    function handleCreateOrderFormSubmit(values) {
        const onSuccess = () => {
            message.success("Order Created");
            setReload(!reload);
            setShowCreateOrderModal(false);
        }

        const onFail = () => {
            message.error("Order Creation Failed");
            setShowCreateOrderModal(false);
        }
        dispatch(createOrder({
            values: values,
            onSuccess,
            onFail
        }));
        
    }



    function handleReOrderBtnClick(id) {

        const onSuccess = () => {
            message.success("Re-Order Successful");
        }
        const onFail = () => {
            message.error("Re-Order Failed");
        }
        dispatch(reOrder({
            id,
            onSuccess,
            onFail
        }));
        setReload(!reload);
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={orders.orders}
                rowKey={(record) => record._id}
                title={getHeadSection}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: orders.totalOrders,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items and ${Math.ceil(total / pageSize)} Pages`,
                }}
                loading={isLoading}
                onChange={handleTableChange}
            />
            <Modal
                title="Create Order Modal"
                open={showCreateOrderModal}
                onCancel={hideCreateOrderModal}
                footer={null}
            >
                <OrderForm
                    onSubmit={handleCreateOrderFormSubmit}
                />
            </Modal>
            <Modal
                title="Edit Order Modal"
                open={showEditOrderModal}
                onCancel={hideEditOrderModal}
                footer={null}
            >
                <OrderForm
                    onSubmit={handleEditOrderFormSubmit}
                    order={selectedOrder}
                />
            </Modal>

            <ConfirmationModal
                visible={showDeleteConfirmModal}
                onConfirm={handleConfirmDeleteBtnClick}
                onCancel={hideDeleteConfirmModal}
                title="Delete Order"
                message="Are you sure you want to delete this order?"
            ></ConfirmationModal>

        </>
    );
}

export default OrdersTable;