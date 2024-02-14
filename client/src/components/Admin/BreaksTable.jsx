import { Table, Space, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import React, { useEffect, useState } from 'react';
import { getBreaks } from '../../redux/Features/Break/breakSlice';
import { useDispatch, useSelector } from 'react-redux';

const BreaksTable = () => {
    const dispatch = useDispatch();
    const { breaks, loading } = useSelector((state) => state.break);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [reload, setReload] = useState(false);
    useEffect(() => {
        dispatch(getBreaks({
            page,
            pageSize,
            search: search.trim()
        }));
    }, [reload, page, pageSize, reload, dispatch, search]);


    useEffect(() => {
        setPage(1);
    }, [pageSize, search]);

    function handleTableChange(pagination) {
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    }


    function getFormatedTime(date) {
        if (!date) {
            return '';
        }

        const time = new Date(date);
        return time.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }


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
            title: 'User Name',
            key: 'fullname',
            render: (text, record) => (
                <Space size="middle">
                    {renderColumnWithHighlight(record.user.fullname)}
                </Space>
            ),
        },
        {
            title: 'User Dashboard',
            key: 'dashboard',
            render: (text, record) => (
                <Space size="middle">
                    {record.user.dashboard}
                </Space>
            ),
        },
        {
            title: 'Start Time',
            key: 'startTime',
            render: (text, record) => (
                <Space size="middle">
                    {getFormatedTime(record.startTime)}
                </Space>
            ),
        },
        {
            title: 'End Time',
            key: 'endTime',
            render: (text, record) => (
                <Space size="middle">
                    {getFormatedTime(record.endTime)}
                </Space>
            ),
        },
    ];


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

    const getHeadSection = () => {
        return (
            <div>
                <h2 className='text-2xl text-left'>Breaks</h2>
                {searchMarkup}
            </div>
        );
    }
    return <Table
        columns={columns}
        dataSource={breaks.breaks}
        rowKey={(record) => record._id}
        pagination={{
            total: breaks.totalBreaks,
            pageSize: pageSize,
            current: page,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items and ${Math.ceil(total / pageSize)} Pages`,
        }}
        onChange={handleTableChange}
        title={getHeadSection}
        loading={loading}
    />;
}
export default BreaksTable;