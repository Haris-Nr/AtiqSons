import React, { createContext, useState, useEffect } from 'react';
const TimerContext = createContext();
import { useSelector, useDispatch } from 'react-redux';
import { createActivityLog } from '../redux/Features/ActivityLog/activityLogSlice'
const TimerProvider = ({ children }) => {
    const [clockedIn, setClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const user = useSelector((state) => state.fetch.user);
    const dispatch = useDispatch();

    const isAdmin = () => {
        return user.employee?.role === 'admin' || user.employee?.role === 'superadmin';
    }


    useEffect(() => {
        let timer;

        const updateElapsedTime = () => {
            setElapsedTime(elapsedTime => {
                if ((elapsedTime / 1000) % 10 === 0) {
                    // write to local storage every 10 seconds
                    localStorage.setItem('TIMER_ELAPSED_TIME', elapsedTime);
                }
                return (elapsedTime || 0) + 1000;
            });
        };

        if (clockedIn) {
            timer = setInterval(updateElapsedTime, 1000);
        } else {
            clearInterval(timer);
            if (startTime) {
                dispatch(createActivityLog({ 
                    data: {
                        startTime, 
                    endTime: Date.now(), 
                    user: user.employee._id
                    },
                    onSuccess: () => {
                        console.log('Activity log created');
                    },
                    onFail: () => {
                        console.log('Activity log failed');
                    }
                }));
            }
        }

        return () => clearInterval(timer);
    }, [clockedIn]);


    useEffect(() => {
        if (!isAdmin()) {
            let inactivityTimer;

            const handleUserActivity = () => {
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                    setClockedIn(false);
                }, parseFloat(import.meta.env.VITE_EMPLOYEE_INACTIVITY_TIMEOUT) * 1000);
            };

            window.addEventListener('mousemove', handleUserActivity);
            window.addEventListener('keypress', handleUserActivity);

            return () => {
                window.removeEventListener('mousemove', handleUserActivity);
                window.removeEventListener('keypress', handleUserActivity);
            };
        }
    }, []);


    useEffect(() => {
        const storedElapsedTime = localStorage.getItem('TIMER_ELAPSED_TIME');
        if (storedElapsedTime) {
            setElapsedTime(parseInt(storedElapsedTime, 10));
        }
    }, []);


    const handleClockIn = () => {
        setStartTime(Date.now());
        setClockedIn(true);
    };


    const handleClockOut = () => {
        setStartTime(null);
        setElapsedTime(0);
        setClockedIn(false);
        localStorage.removeItem('TIMER_ELAPSED_TIME');
    };

    const timerContextValue = {
        clockedIn,
        startTime,
        elapsedTime,
        handleClockIn,
        handleClockOut
    };

    return (
        <TimerContext.Provider value={timerContextValue}>
            {children}
        </TimerContext.Provider>
    );
};

export { TimerProvider, TimerContext };
