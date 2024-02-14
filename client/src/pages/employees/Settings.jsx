import React, { useState } from "react";
import { DatePicker, Button, TimePicker, message } from "antd";
import { useDispatch } from "react-redux";
import { createBreak } from "../../redux/Features/Break/breakSlice";

const SettingsPage = () => {
    const [breakStart, setBreakStart] = useState(null);
    const [breakEnd, setBreakEnd] = useState(null);
    const [leaveStart, setLeaveStart] = useState(null);
    const [leaveEnd, setLeaveEnd] = useState(null);
    const dispatch = useDispatch();

    function onSucess(isLeave) {
        message.success(isLeave ? "Leave request submitted" : "Break submitted");
    }

    function onFail(isLeave) {
        message.error(
            isLeave ? "Failed to submit leave request" : "Failed to submit break"
        );
    }

    const handleBreakSubmit = async () => {
        dispatch(
            createBreak({
                startTime: breakStart.$d,
                endTime: breakEnd.$d,
                isLeave: false,
                onSucess: () => onSucess(false),
                onFail: () => onFail(false),
            })
        );
    };

    const handleLeaveSubmit = async () => {
        dispatch(
            createBreak({
                startTime: leaveStart.$d,
                endTime: leaveEnd.$d,
                isLeave: true,
                onSucess: () => onSucess(true),
                onFail: () => onFail(true),
            })
        );
    };

    return (
        <div className="flex justify-center">
            <div className="container mx-auto px-4 w-2/3">
                <h1 className="text-3xl font-bold my-4 text-left">Settings</h1>

                <div className="my-4 text-left">
                    <h2 className="text-xl font-semibold mb-2 text-left">Take a Break</h2>
                    <div className="flex mb-2">
                        <div className="w-1/3">
                            <TimePicker.RangePicker
                                format="HH:mm"
                                className="w-full"
                                onChange={(times) => {
                                    setBreakStart(times[0]);
                                    setBreakEnd(times[1]);
                                }}
                            />
                        </div>
                        <div className="w-1/3">
                            <Button
                                type="primary"
                                onClick={handleBreakSubmit}
                                className="ml-2 w-48"
                            >
                                Submit Break
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="my-4">
                    <h2 className="text-xl font-semibold mb-2 text-left">
                        Request Leave
                    </h2>

                    <div className="flex mb-2">
                        <div className="w-1/3 text-left">
                            <DatePicker.RangePicker
                                className="w-full"
                                onChange={(dates) => {
                                    setLeaveStart(dates[0]);
                                    setLeaveEnd(dates[1]);
                                }}
                            />
                        </div>
                        <div className="w-1/3 text-left">
                            <Button
                                type="primary"
                                onClick={handleLeaveSubmit}
                                className="ml-2 w-48"
                            >
                                Submit Leave Request
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
