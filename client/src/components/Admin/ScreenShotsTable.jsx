import { Table, Space, Button, Modal, message, Input } from 'antd';
import React, { useEffect, useState} from 'react';
import {
    getAllScreenShots,
    deleteScreenShot
} from '../../redux/Features/ScreenShot/screenShotSlice';
import Highlighter from 'react-highlight-words';
import { useSelector, useDispatch } from 'react-redux';

const { Search } = Input;

const ScreenShotTable = () => {
    const {
        screenShots,
        loading,
    } = useSelector((state) => state.screenShot);

    const dispatch = useDispatch();

    const [showScreenShotModal, setShowScreenShotModal] = useState(false);
    const [currentScreenshot, setCurrentScreenshot] = useState(null);
    const [reload, setReload] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(getAllScreenShots({
            page,
            limit,
            search
        }));
    }, [dispatch,reload, page, limit, search]);

    useEffect(() => {
        setPage(1);
    }, [limit, search]);

    function getFormattedTime(date) {
        const d = new Date(date);
        return d.toLocaleString();
    }

    const renderColumnWithHighlight = (text) => (
        <Highlighter
          highlightStyle={{
            backgroundColor: "yellow",
            padding: 0,
          }}
          searchWords={[search]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      );

    const columns = [
        {
            title: 'Screen Shot',
            dataIndex: 'screenShot',
            key: 'screenShot',
            render: (text) => <img
                src={import.meta.env.VITE_API_BASE_URL + text}
                alt="Screenshot"
                style={{ maxWidth: '100px' }}
            />,
        },
        {
            title: 'User',
            dataIndex: ['user', 'fullname'],
            key: 'user',
            render: (text) => renderColumnWithHighlight(text),
        },
        {
            title: 'Created By',
            dataIndex: ['createdBy', 'fullname'],
            key: 'createdBy',
            render: (text) => renderColumnWithHighlight(text),
        },
        {
            title: 'Date Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => getFormattedTime(text),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleViewBtnClick(record)}>View</Button>
                    <Button onClick={() => handleDeleteBtnClick(record._id)} type="danger">Delete</Button>
                </Space>
            ),
        },
    ];

    const handleViewBtnClick = (record) => {
        setCurrentScreenshot(record.screenShot);
        setShowScreenShotModal(true);
    };

    const handleDeleteBtnClick = (id) => {
        const onSuccess = () => {
            message.success('Screenshot deleted successfully');
            setReload(!reload);
        }

        const onFail = () => {
            message.error('Failed to delete screenshot');
        }
        dispatch(deleteScreenShot({
            id,
            onSuccess,
            onFail
        }));

    }

    const handleCancel = () => {
        setShowScreenShotModal(false);
    };

    const handlePaginationChange = (page, pageSize) => {
        setPage(page);
        setLimit(pageSize);
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };



    return (
        <>
            <div 
                className={'flex justify-start items-center mb-4 sm:w-full md:w-1/2'}>

                <Search 
                    className='w-full'
                    placeholder="Search" 
                    onSearch={handleSearch} 
                />
            </div>
            <Table
             bordered
             size="middle"
                columns={columns}
                dataSource={screenShots.screenShots}
                rowKey={(record) => record._id}
                scroll={{ x: true }}
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: screenShots.totalScreenShots,
                    onChange: handlePaginationChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />
            <Modal
                title="Screenshot"
                open={showScreenShotModal}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                {currentScreenshot && <img src={import.meta.env.VITE_API_BASE_URL + currentScreenshot} alt="Screenshot" style={{ width: '100%' }} />}
            </Modal>
        </>
    );
};

export default ScreenShotTable;
