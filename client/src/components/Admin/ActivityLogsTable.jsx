import { Table, Space, Button, Modal, message, Input, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    getAllActivityLogs,
    getAggregatedLogs,
    deleteActivityLog
} from '../../redux/Features/ActivityLog/activityLogSlice';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useSelector, useDispatch } from 'react-redux';

const { Search } = Input;

const ActivityLogsTable = () => {
    const {
        activityLogs,
        aggregatedLogs,
        loading,
    } = useSelector((state) => state.activityLog);

    const dispatch = useDispatch();


    const [reload, setReload] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [search, setSearch] = useState('');
    const [aggregatedView, setAggregatedView] = useState(false); // State to toggle aggregated view

    useEffect(() => {

        if (!aggregatedView) {
            dispatch(getAllActivityLogs({
                page,
                limit,
                search
            }));
        } else {
            dispatch(getAggregatedLogs({
                page,
                limit,
                search
            }));
        }
    }, [dispatch, reload, page, limit, search, aggregatedView]);

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

    const columns = aggregatedView ? [
        {
            title: 'User',
            dataIndex: ['user', 'fullname'],
            key: 'user',
            render: (text) => renderColumnWithHighlight(text),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => text,
        },
        {
            title: 'Total Time',
            dataIndex: 'totalTime',
            key: 'totalTime',
            render: (text) => (formatSpentTime(text)),
        }
    ] : [
        {
            title: 'User',
            dataIndex: ['user', 'fullname'],
            key: 'user',
            render: (text) => renderColumnWithHighlight(text),
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (text) => getFormattedTime(text),
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text) => getFormattedTime(text),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleDeleteBtnClick(record._id)} type="danger">Delete</Button>
                </Space>
            ),
        },
    ]
    const handleDeleteBtnClick = (id) => {
        const onSuccess = () => {
            message.success('Activity log deleted successfully');
            setReload(!reload);
        }

        const onFail = () => {
            message.error('Failed to delete activity log');
        }
        dispatch(deleteActivityLog({
            id,
            onSuccess,
            onFail
        }));

    }



    const handlePaginationChange = (page, pageSize) => {
        setPage(page);
        setLimit(pageSize);
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleSwitchChange = (checked) => {
        setAggregatedView(checked);
    };

    const data = aggregatedView ? aggregatedLogs.aggregatedLogs : activityLogs.activityLogs;

    return (
        <>
            <div className={'flex justify-between items-center mb-4 w-full'}>
                <Search
                    className='sm:w-full md:w-1/2'
                    placeholder="Search"
                    onSearch={handleSearch}
                />
                <div className="border border-gray-300 rounded p-2">

                    <Switch
                        style={{ backgroundColor: aggregatedView ? 'blue' : 'gray' }}
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={aggregatedView}
                        onChange={handleSwitchChange}
                    />
                    <span className="ml-2">Show Aggregated View</span>
                </div>

            </div>

            <Table
                bordered
                size="middle"
                columns={columns}
                dataSource={data}
                rowKey={(record) => record._id}
                scroll={{ x: true }}
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: limit,
                    total: aggregatedView ? aggregatedLogs.totalAggregatedLogs : activityLogs.totalActivityLogs,
                    onChange: handlePaginationChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
            />

        </>
    );
};

export default ActivityLogsTable;

function formatSpentTime(elapsedTime) {
    // Format elapsed time into hours, minutes, and seconds
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    // Add leading zeros if less than 10
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

