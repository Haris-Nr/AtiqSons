import React, { useEffect, useState } from "react";
import { LikeOutlined, HolderOutlined, DislikeOutlined, StrikethroughOutlined, RiseOutlined, FileSearchOutlined, } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllStats,getAllCompletedDailyTasksWithEmployeeDetails } from "../../redux/Features/Stats/statsSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from "./StatCard";
import { Col, Row, Progress, Button,Select } from "antd";
const { Option } = Select;

const AllStats = () => {
    const dispatch = useDispatch();
    const { statsData,empTaskData } = useSelector((state) => state.stats);
    const options = ['week', 'month', 'year'];
    const [timeFrame, setTimeFrame] = useState(options[0]);

    // State to store the selected time frame
    const handleTimeFrameChange = (value) => {
        setTimeFrame(value);
    };
    useEffect(() => {
        dispatch(getAllStats(timeFrame));
        dispatch(getAllCompletedDailyTasksWithEmployeeDetails());
    },[dispatch,timeFrame])

    const getWeekdayOrMonthOrYear = (date, timeFrame) => {
        const weekdaysAbbreviated = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthsAbbreviated = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dayIndex = date.getDay();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        switch (timeFrame) {
            case 'week':
                return weekdaysAbbreviated[dayIndex];
            case 'month':
                return monthsAbbreviated[monthIndex];
            case 'year':
                return year.toString();
            default:
                return '';
        }
    };

    // Extract the necessary data for the chart for amazon
    const amazonData = statsData.amazonStats?.map(item => ({
        name: getWeekdayOrMonthOrYear(new Date(item._id), timeFrame),
        count: item.count,
        product: "Amazon"
    }));

    // Extract the necessary data for the chart for Noon
    const noonData = statsData.noonStats?.map(item => ({
        name: getWeekdayOrMonthOrYear(new Date(item._id), timeFrame),
        count: item.count,
        product: "Noon"
    }));

    return (
        <div>
            <Row className="flex flex-wrap" gutter={[16, 16]}>
                <Col xs={24} lg={12} className="w-full">
                    <Row gutter={[16, 16]}>
                        <Col span={24} className="sm:flex gap-3">
                            <StatCard
                                icon={
                                    <LikeOutlined
                                        className="text-3xl p-6"
                                        style={{
                                            color: '#504BE4',
                                            backgroundColor: '#F8F8FB',
                                            borderRadius: 40,
                                        }}
                                    />
                                }
                                title={'Approved Product'}
                                value={statsData.approvedCount}
                            />
                            <StatCard
                                icon={
                                    <DislikeOutlined
                                        className="text-3xl p-6"
                                        style={{
                                            color: '#EF2944',
                                            backgroundColor: '#F8F8FB',
                                            borderRadius: 40,
                                        }}
                                    />
                                }
                                title={'Rejected Product'}
                                value={statsData.rejectedCount}
                            />
                            <StatCard
                                icon={
                                    <HolderOutlined
                                        className="text-3xl p-6"
                                        style={{
                                            color: '#5eb2e6',
                                            backgroundColor: '#F8F8FB',
                                            borderRadius: 40,
                                        }}
                                    />
                                }
                                title={'Holding Product'}
                                value={statsData.holdingCount}
                            />
                        </Col>
                        <Col span={24} className="sm:flex gap-3">
                            <StatCard
                                icon={
                                    <StrikethroughOutlined
                                        className="text-3xl p-6"
                                        style={{
                                            color: '#06B48A',
                                            backgroundColor: '#F8F8FB',
                                            borderRadius: 40,
                                        }}
                                    />
                                }
                                title={'Seasonal Product'}
                                value={statsData.seasonalCount}
                            />
                            <StatCard
                                icon={
                                    <RiseOutlined
                                        className="text-3xl p-6"
                                        style={{
                                            color: '#504BE4',
                                            backgroundColor: '#F8F8FB',
                                            borderRadius: 40,
                                        }}
                                    />
                                }
                                title={'Priority Product'}
                                value={statsData.priorityCount}
                            />
                            <StatCard
                                icon={
                                    <FileSearchOutlined
                                        className="text-3xl p-6"
                                        style={{
                                            color: '#06B48A',
                                            backgroundColor: '#F8F8FB',
                                            borderRadius: 40,
                                        }}
                                    />
                                }
                                title={'InTracking Product'}
                                value={statsData.trackingCount}
                            />
                        </Col>
                        <Col span={24} md={8}>
                            <div className="mx-auto bg-white p-6 rounded-lg shadow-lg" style={{ maxHeight: '50%', overflowY: 'auto' }}>
                                <div className="flex justify-between items-center pb-4">
                                    <h2 className="text-xl font-semibold">Tasks Progress</h2>
                                    <Button type="default">All Tasks</Button>
                                </div>
                                <div>
                                    {empTaskData.map((task) => (
                                        <div key={task.employeeName} className="flex items-center justify-between py-4 border-b-2 border-gray-200">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <h3 className="md:text-lg font-medium">{task.employeeName}</h3>
                                                    <p className="md:text-sm text-gray-600">{task.totalDailyTasks}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <Progress type="circle" size={60} percent={task.completedTasks} format={(percent) => `${percent}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} lg={12} className="w-full -mt-96 sm:-mt-72 lg:mt-6 ">
                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <div className="sm:flex sm:justify-between items-center pb-4">
                            <div className="flex gap-2">
                                <div className="text-lg text-left font-semibold">{timeFrame.toLocaleUpperCase()}</div>
                                <div className="text-xl font-bold text-indigo-600">PRODUCTS</div>
                            </div>
                            <div className="text-left">
                                <Select defaultValue={options[0]} style={{ width: 120 }} onChange={handleTimeFrameChange}>
                                    {options.map(option => (
                                        <Option key={option} value={option}>{option}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" aspect={4 / 3}>
                            <LineChart >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickCount={5} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" name="Amazon Product" stroke="#8884d8" strokeWidth={4} activeDot={{ r: 8 }} data={amazonData} />
                                <Line type="monotone" dataKey="count" name="Noon Product" stroke="#82ca9d" strokeWidth={4} data={noonData} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default AllStats