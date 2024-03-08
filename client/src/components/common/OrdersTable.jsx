import {
    Table,
    Space,
    Button,
    Modal,
    Input,
    Select,
    Image,
    Tooltip
} from 'antd';
import { FaPencilAlt, FaEdit, FaTrashAlt, FaCopy, FaRedo } from 'react-icons/fa';
import { useContext } from 'react';
import Highlighter from 'react-highlight-words';
import OrderForm from '../Admin/OrderForm';
import PriceForm from '../China/PriceForm';
import ConfirmationModal from './ConfirmationModal';
import { OrdersContext } from '../../contexts/OrdersContext';
import { defaultCurrency } from '../../utils/currencyOptions';


const OrdersTable = () => {
    const {
        currentPage,
        pageSize,
        search,
        setSearch,
        showCreateOrderModal,
        showEditOrderModal,
        showDeleteConfirmModal,
        selectedOrder,
        reload,
        setReload,
        selectedCurrency,
        setSelectedCurrency,
        showAddPriceModal,
        showEditPriceModal,
        showAddExwPriceModal,
        showEditExwPriceModal,
        orders,
        isLoading,
        selectedCurrencyExchangeRate,
        isLoadingExchangeRate,
        currencyOptions,
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
    } = useContext(OrdersContext);


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

    const columns = [
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'ASIN',
            dataIndex: 'asin',
            key: 'asin',
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
            title: <span>Total Price</span>,
            key: 'totalPrice',
            render: (text, record) => {
                
                const totalPrice = (record.price===-1 ? 0 : record.price) + 
                                   (record.exwPrice === -1 ? 0 : record.exwPrice);
                if (isLoadingExchangeRate) {
                    return <span>Loading...</span>;
                }
                return (
                    <span>
                        {selectedCurrency !== defaultCurrency ? (totalPrice * selectedCurrencyExchangeRate.rate).toFixed(2) : totalPrice.toFixed(2)}
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
                <>
                    <Space size="middle">
                        <Tooltip title="Edit">
                            <FaEdit
                                onClick={() => handleEitOrderBtnClick(record)}
                                className="cursor-pointer"
                                style={{ fontSize: '1.2rem' }}
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <FaTrashAlt
                                onClick={() => handleDeleteOrderBtnClick(record)}
                                className="cursor-pointer"
                                style={{ fontSize: '1.2rem' }}
                            />
                        </Tooltip>
                        <Tooltip title="Copy to stock">
                            <FaCopy
                                onClick={() => handleCopyToInventoryBtnClick(record._id)}
                                className="cursor-pointer"
                                style={{ fontSize: '1.2rem' }}
                            />
                        </Tooltip>
                        <Tooltip title="Reorder">
                            <FaRedo
                                onClick={() => handleReOrderBtnClick(record._id)}
                                className="cursor-pointer"
                                style={{ fontSize: '1.2rem' }}
                            />
                        </Tooltip>
                    </Space>
                </>
            )
        })
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