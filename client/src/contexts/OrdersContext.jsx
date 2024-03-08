import React, { createContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getOrders,
    createOrder,
    reOrder,
    updateOrder,
    deleteOrder,
    copyToInventory
} from '../redux/Features/Order/orderSlice';
import {
    getExchangeRate,
    getCurrencyOptions,
} from '../redux/Features/ExchangeRate/exchangeRateSlice';
import { defaultCurrency } from '../utils/currencyOptions';
import { message } from 'antd';

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
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


    // COPY TO INVENTORY
    function handleCopyToInventoryBtnClick(id) {
        const onSuccess = () => {
            message.success("Copied to Inventory");
            setReload(!reload);
        }
        const onFail = () => {
            message.error("Copy to Inventory Failed");
        }
        dispatch(copyToInventory({
            id,
            onSuccess,
            onFail
        }));
    }

    return (
        <OrdersContext.Provider
            value={{
                // state values
                currentPage,
                setCurrentPage,
                pageSize,
                setPageSize,
                search,
                setSearch,
                showCreateOrderModal,
                setShowCreateOrderModal,
                showEditOrderModal,
                setShowEditOrderModal,
                showDeleteConfirmModal,
                setShowDeleteConfirmModal,
                selectedOrder,
                setSelectedOrder,
                reload,
                setReload,
                selectedCurrency,
                setSelectedCurrency,
                showAddPriceModal,
                setShowAddPriceModal,
                showEditPriceModal,
                setShowEditPriceModal,
                showAddExwPriceModal,
                setShowAddExwPriceModal,
                showEditExwPriceModal,
                setShowEditExwPriceModal,
                orders,
                isLoading,
                errorMessage,
                selectedCurrencyExchangeRate,
                isLoadingExchangeRate,
                currencyOptions,
                exchangeRateErrorMessage,
                user,
                // functions
                handleTableChange,
                isAdmin,
                currencyOptionWithDefault,
                handleAddPriceBtnClick,
                hideAddPriceModal,
                handleAddPriceFormSubmit,
                handleEditPriceBtnClick,
                hideEditPriceModal,
                handleEditPriceFormSubmit,
                handleAddExwPriceBtnClick,
                hideAddExwPriceModal,
                handleAddExwPriceFormSubmit,
                handleEditExwPriceBtnClick,
                hideEditExwPriceModal,
                handleEditExwPriceFormSubmit,
                handleOrderStatusChangeBtnClick,
                handleEitOrderBtnClick,
                hideEditOrderModal,
                handleEditOrderFormSubmit,
                handleDeleteOrderBtnClick,
                handleConfirmDeleteBtnClick,
                hideDeleteConfirmModal,
                handleCreateOrderBtnClick,
                hideCreateOrderModal,
                handleCreateOrderFormSubmit,
                handleReOrderBtnClick,
                handleCopyToInventoryBtnClick
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
};