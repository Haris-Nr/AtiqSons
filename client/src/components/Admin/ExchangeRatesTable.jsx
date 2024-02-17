import { Table, Space, Button, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getExchangeRates,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate
} from '../../redux/Features/ExchangeRate/exchangeRateSlice';
import ExchangeRatesForm from './ExchangeRatesForm';
import { defaultCurrency } from '../../utils/currencyOptions';

const ExchangeRatesTable = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showCreateExchangeRateModal, setShowCreateExchangeRateModal] = useState(false);
    const [showEditExchangeRateModal, setShowEditExchangeRateModal] = useState(false);
    const [activeExchangeRate, setActiveExchangeRate] = useState({});
    const [search] = useState('');
    const [reload, setReload] = useState(false);

    const {
        exchangeRates,
        isLoading,
        errorMessage
    } = useSelector((state) => state.exchangeRate);


    useEffect(() => {
        dispatch(getExchangeRates({
            page: currentPage,
            pageSize,
            search
        }));
    }, [dispatch, currentPage, pageSize, search, reload]);


    useEffect(() => {
        if (errorMessage) {
            message.error(errorMessage);
        }
    }, [errorMessage])

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };





    const columns = [
        {
            title: 'Currency 1',
            dataIndex: 'currency1',
            key: 'currency1',
        },
        {
            title: 'Currency 2',
            dataIndex: 'currency2',
            key: 'currency2',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=> handleEditBtnClick(record)}>Edit</Button>
                    <Button type="danger" onClick={()=> handleDeleteBtnClick(record)}>Delete</Button>
                </Space>
            ),
        }
    ];



    const getHeadSection = () => (
        <div className="flex justify-between w-full">
            <h1 className="text-2xl">Exchange Rates</h1>
            <Button type="primary" onClick={handleCreateExchangeRateBtnClick}>
                Create Exchange Rate
            </Button>
        </div>
    );



    function handleCreateExchangeRateBtnClick() {
        setShowCreateExchangeRateModal(true);
    }

    function hideCreateExchangeRateModal() {
        setShowCreateExchangeRateModal(false);
    }


    function handleCreateExchangeRateFormSubmit(values) {
        if(values.currency1 === values.currency2) {
            return message.error("Currency 1 and Currency 2 cannot be the same");
        }

        if(values.currency1 !== defaultCurrency && values.currency2 !== defaultCurrency) {
            return message.error("One of the currencies must be the "+defaultCurrency);
        }

        const onSuccess = () => {
            message.success('Exchange Rate Created Successfully');
            setReload(!reload);
            setShowCreateExchangeRateModal(false);
        }

        const onFail = () => { 
            message.error('Failed to create Exchange Rate');
            setShowCreateExchangeRateModal(false);
        }
        dispatch(createExchangeRate({
            values: values,
            onSuccess,
            onFail
        }));
        
    }


    function handleEditBtnClick(exchangeRate) {
        setActiveExchangeRate(exchangeRate);
        setShowEditExchangeRateModal(true);
    }


    function handleDeleteBtnClick(exchangeRate) {
        dispatch(deleteExchangeRate(exchangeRate._id));
        setReload(!reload);
    }

    function handleEditExchangeRateFormSubmit(updatedExchangeRate) {
        dispatch(updateExchangeRate({
            id: activeExchangeRate._id, 
            updatedExchangeRate
        }));
        setReload(!reload);
        setShowEditExchangeRateModal(false);
    }

    function hideEditExchangeRateModal() {
        setShowEditExchangeRateModal(false);
        setActiveExchangeRate(null)
    }

    
    return (
        <>
            <Table
                columns={columns}
                dataSource={exchangeRates.exchangeRates}
                rowKey={(record) => record._id}
                scroll={{ x: true }}
                title={getHeadSection}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: exchangeRates.totalCount,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                loading={isLoading}
                onChange={handleTableChange}
            />
            <Modal
                title="Create Exchange Rate"
                open={showCreateExchangeRateModal}
                onCancel={hideCreateExchangeRateModal}
                footer={null}
            >
                <ExchangeRatesForm
                    onSubmit={handleCreateExchangeRateFormSubmit}
                />
            </Modal>

            <Modal
                title="Edit Exchange Rate"
                open={showEditExchangeRateModal}
                onCancel={hideEditExchangeRateModal}
                footer={null}
            >
                <ExchangeRatesForm
                    onSubmit={handleEditExchangeRateFormSubmit}
                    exchangeRate={activeExchangeRate}
                />
            </Modal>
        </>
    );
}

export default ExchangeRatesTable;