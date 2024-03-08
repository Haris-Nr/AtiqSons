import {
    Table,
    Space,
    Button,
    Modal,
    message,
    Input,
    Select,
    Image,
} from 'antd';
import { FaPencilAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import {
    getOrders,
    createOrder,
    reOrder,
    updateOrder,
    deleteOrder
} from '../../redux/Features/Order/orderSlice';

import {
    getExchangeRate,
    getCurrencyOptions,
} from '../../redux/Features/ExchangeRate/exchangeRateSlice';


import OrderForm from '../Admin/OrderForm';
import PriceForm from '../China/PriceForm';
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
    const [showAddPriceModal, setShowAddPriceModal] = useState(false);
    const [showEditPriceModal, setShowEditPriceModal] = useState(false);
    const [showAddExwPriceModal, setShowAddExwPriceModal] = useState(false);
    const [showEditExwPriceModal, setShowEditExwPriceModal] = useState(false);

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
    }, [dispatch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize, search])

    useEffect(() => {
        dispatch(getOrders({
            page: currentPage,
            pageSize,
            search: search.trim()
        }));
    }, [dispatch, currentPage, pageSize, reload, search]);


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
            width: '100px',
            render: (picture) => <Image
                src={import.meta.env.VITE_API_BASE_URL + picture}
                alt="Product"
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
            render: (price, record) => {

                if (price === -1) {
                    return <>
                        {
                            <Button
                                onClick={() => handleAddPriceBtnClick(record)}
                            >Add Price</Button>
                        }
                    </>
                }

                if (isLoadingExchangeRate) {
                    return <span>Loading...</span>;
                }

                return (
                    <span className='flex'>
                        <span>
                            {selectedCurrency !== defaultCurrency ? (price * selectedCurrencyExchangeRate.rate).toFixed(2) : price.toFixed(2)}
                        </span>
                        <FaPencilAlt
                            className='ml-2 cursor-pointer'
                            onClick={() => handleEditPriceBtnClick(record)}
                        />
                    </span>
                );
            }
        },
        {
            title: <span>EXW Price {currencySelect}</span>,
            dataIndex: 'exwPrice',
            key: 'exwPrice',
            render: (exwPrice, record) => {

                if (exwPrice === -1) {
                    return <>
                        {
                            <Button
                                onClick={() => handleAddExwPriceBtnClick(record)}
                            >Add Price</Button>
                        }
                    </>
                }

                if (isLoadingExchangeRate) {
                    return <span>Loading...</span>;
                }

                return (
                    <span className='flex'>
                        <span>
                            {selectedCurrency !== defaultCurrency ? (exwPrice * selectedCurrencyExchangeRate.rate).toFixed(2) : exwPrice.toFixed(2)}
                        </span>
                        <FaPencilAlt
                            className='ml-2 cursor-pointer'
                            onClick={() => handleEditExwPriceBtnClick(record)}
                        />
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
                            onChange={(value) => handleOrderStatusChangeBtnClick(value, record)}
                            style={{ width: '100%' }}
                        >
                            <Select.Option
                                value="PENDING"
                            >Pending</Select.Option>
                            <Select.Option value="PROCESSING">Processing</Select.Option>
                            <Select.Option value="IN TRANSIT">In Transit</Select.Option>
                            <Select.Option value="DELIVERED">Delivered</Select.Option>
                            <Select.Option value="CANCELLED">Cancelled</Select.Option>
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

    // PRICE ADD 
    function handleAddPriceBtnClick(order) {
        setSelectedOrder(order);
        setShowAddPriceModal(true);
    }


    function hideAddPriceModal() {
        setShowAddPriceModal(false);
        setSelectedOrder(null);
    }

    function handleAddPriceFormSubmit(values) {

        const onSuccess = () => {
            message.success("Price Added");
            setReload(!reload);
            setShowAddPriceModal(false);
            setSelectedOrder(null);
        }

        const onFail = () => {
            message.error("Price Add Failed");
            setShowAddPriceModal(false);
            setSelectedOrder(null);
        }

        dispatch(updateOrder({
            id: selectedOrder._id,
            orderData: {
                price: values.price
            },
            onSuccess,
            onFail
        }));
    }


    // PRICE EDIT
    function handleEditPriceBtnClick(order) {
        setSelectedOrder(order);
        setShowEditPriceModal(true);
    }

    function hideEditPriceModal() {
        setShowEditPriceModal(false);
        setSelectedOrder(null);
    }

    function handleEditPriceFormSubmit(values) {
        if (values.price === selectedOrder.price) {
            return message.warning("Price is already " + values.price);
        }
        const onSuccess = () => {
            message.success("Price Updated");
            setReload(!reload);
            setShowEditPriceModal(false);
            setSelectedOrder(null);
        }

        const onFail = () => {
            message.error("Price Update Failed");
            setShowEditPriceModal(false);
            setSelectedOrder(null);
        }

        dispatch(updateOrder({
            id: selectedOrder._id,
            orderData: {
                price: values.price
            },
            onSuccess,
            onFail
        }));
    }

    // EXW PRICE ADD
    function handleAddExwPriceBtnClick(order) {
        setSelectedOrder(order);
        setShowAddExwPriceModal(true);
    }

    function hideAddExwPriceModal() {
        setShowAddExwPriceModal(false);
        setSelectedOrder(null);
    }

    function handleAddExwPriceFormSubmit(values) {
        const onSuccess = () => {
            message.success("Price Added");
            setReload(!reload);
            setShowAddExwPriceModal(false);
            setSelectedOrder(null);
        }

        const onFail = () => {
            message.error("Price Add Failed");
            setShowAddExwPriceModal(false);
            setSelectedOrder(null);
        }

        dispatch(updateOrder({
            id: selectedOrder._id,
            orderData: {
                exwPrice: values.price
            },
            onSuccess,
            onFail
        }));
    }

    // EXW PRICE EDIT
    function handleEditExwPriceBtnClick(order) {
        setSelectedOrder(order);
        setShowEditExwPriceModal(true);
    }

    function hideEditExwPriceModal() {
        setShowEditExwPriceModal(false);
        setSelectedOrder(null);
    }

    function handleEditExwPriceFormSubmit(values) {
        if (values.price === selectedOrder.exwPrice) {
            return message.warning("Price is already " + values.price);
        }

        const onSuccess = () => {
            message.success("Price Updated");
            setReload(!reload);
            setShowEditExwPriceModal(false);
            setSelectedOrder(null);
        }

        const onFail = () => {
            message.error("Price Update Failed");
            setShowEditExwPriceModal(false);
            setSelectedOrder(null);
        }

        dispatch(updateOrder({
            id: selectedOrder._id,
            orderData: {
                exwPrice: values.price
            },
            onSuccess,
            onFail
        }));
    }

    // ORDER STATUS CHANGE
    function handleOrderStatusChangeBtnClick(value, order) {

        if (value === order.status) {
            return message.warning("Order Status is already " + value);
        }

        const onSuccess = () => {
            message.success("Order Status Updated");
        }
        const onFail = () => {
            message.error("Order Status Update Failed");
        }

        dispatch(updateOrder({
            id: order._id,
            orderData: {
                status: value,
            },
            onSuccess,
            onFail
        }))

        setReload(!reload);
    }



    // ORDER EDIT
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



    // DELETE ORDER
    function handleDeleteOrderBtnClick(order) {
        setSelectedOrder(order);
        setShowDeleteConfirmModal(true);
    }


    function handleConfirmDeleteBtnClick() {
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



    // TABLE HEAD SECTION
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
        <div className='space-y-3'>
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
            {searchMarkup}
        </div>
    );


    function getHeadSection() {
        if (isAdmin()) {
            return adminUserHeadSection();
        } else {
            return employeeUserHeadSection();
        }
    }

    // CREATE ORDER
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


    // RE-ORDER
    function handleReOrderBtnClick(id) {

        const onSuccess = () => {
            message.success("Re-Order Successful");
            setReload(!reload);

        }
        const onFail = () => {
            message.error("Re-Order Failed");
        }
        dispatch(reOrder({
            id,
            onSuccess,
            onFail
        }));
    }

    return (
        <>
            <Table
                size='middle'
                bordered
                columns={columns}
                dataSource={orders.orders}
                rowKey={(record) => record._id}
                title={getHeadSection}
                scroll={{ x: true }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: orders.totalOrders,
                    showSizeChanger: true,
                    showQuickJumper: true,
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

            <Modal
                title="Add Price"
                open={showAddPriceModal}
                onCancel={hideAddPriceModal}
                footer={null}
            >
                <PriceForm
                    onSubmit={handleAddPriceFormSubmit}
                />
            </Modal>

            <Modal
                title="Edit Price"
                open={showEditPriceModal}
                onCancel={hideEditPriceModal}
                footer={null}
            >
                <PriceForm
                    onSubmit={handleEditPriceFormSubmit}
                    price={selectedOrder?.price}
                />
            </Modal>



            <Modal
                title="Add EXW Price"
                open={showAddExwPriceModal}
                onCancel={hideAddExwPriceModal}
                footer={null}
            >
                <PriceForm
                    onSubmit={handleAddExwPriceFormSubmit}
                />
            </Modal>

            <Modal
                title="Edit EXW Price"
                open={showEditExwPriceModal}
                onCancel={hideEditExwPriceModal}
                footer={null}
            >
                <PriceForm
                    onSubmit={handleEditExwPriceFormSubmit}
                    price={selectedOrder?.exwPrice}
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