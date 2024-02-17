import { Table, Space, Tag, Input, Button, message } from 'antd';
import Highlighter from 'react-highlight-words';
import React, { useEffect, useState } from 'react';
import {
    getLeaves,
    approveLeave,
    rejectLeave
} from '../../redux/Features/Break/breakSlice';
import { useDispatch, useSelector } from 'react-redux';

const LeavesTable = () => {
    const dispatch = useDispatch();
    const { leaves, loading } = useSelector((state) => state.break);
    const  user  = useSelector((state) => state.fetch.user);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [reload, setReload] = useState(false);

    function isAdmin() {
        return user.employee?.role === 'admin' || user.employee?.role === 'superadmin';
    }

    useEffect(() => {
        dispatch(getLeaves({
            page,
            pageSize,
            search: search.trim(),
            filter: isAdmin() ? 'all' : 'mine'
        }));
    }, [user, reload, page, pageSize, dispatch,search]);


    useEffect(() => {
        setPage(1);
    }, [pageSize, search]);

    function handleTableChange(pagination) {
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    }





    function getFormatedDate(date) {
        if (!date) {
            return '';
        }

        const time = new Date(date);
        return time.toLocaleDateString('en-US');
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


    function handleApproveLeave(id) {
        dispatch(approveLeave({
            id,
            onSuccess: () => {
                setReload(!reload);
            },
            onFail: () => {
                message.error('Failed to reject leave');
            }
        }));
    }

    function handleRejectLeave(id) {
        dispatch(rejectLeave({
            id,
            onSuccess: () => {
                setReload(!reload);
            },
            onFail: () => {
                message.error('Failed to reject leave');
            }
        }));
    }

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
            title: 'Start Date',
            key: 'startTime',
            render: (text, record) => (
                <Space size="middle">
                    {getFormatedDate(record.startTime)}
                </Space>
            ),
        },
        {
            title: 'End Date',
            key: 'endTime',
            render: (text, record) => (
                <Space size="middle">
                    {getFormatedDate(record.endTime)}
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'PENDING' ? 'blue' : status === 'APPROVED' ? 'green' : 'volcano'} key={status}>
                    {status}
                </Tag>
            ),
        },
        

    ];


    

    if(isAdmin()){
        columns.push({
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {record.status === "PENDING" ? 
                    <div>
                        <Button
                            type="primary"
                            onClick={() => handleApproveLeave(record._id)}
                        >Approve</Button>
                        <Button
                            type="danger"
                            className='ml-2'
                            onClick={() => handleRejectLeave(record._id)}
                        >Reject</Button>
                    </div> :
                    // if status is not pending, show the status
                    <Tag color={record.status === 'APPROVED' ? 'green' : 'volcano'} key={record.status}>
                        LEAVE {record.status}
                    </Tag>
                    }
                </Space>
            ),
        })
    }


    const searchMarkup = <div className="flex justify-between w-full">
        <Input
            placeholder="Search in Leaves"
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
                <h2 className='text-2xl text-left'>Leaves</h2>
                {searchMarkup}
            </div>
        );
    }
    return <Table
        columns={columns}
        dataSource={leaves.breaks}
        rowKey={(record) => record._id}
        scroll={{ x: true }}
        pagination={{
            total: leaves.totalBreaks,
            pageSize: pageSize,
            current: page,
            showSizeChanger: true,
            showQuickJumper: true,
        }}
        onChange={handleTableChange}
        title={getHeadSection}
        loading={loading}
    />;
}
export default LeavesTable;