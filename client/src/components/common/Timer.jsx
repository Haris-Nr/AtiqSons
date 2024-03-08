import React, { useContext } from 'react';
import { FaPlayCircle, FaRegClock, FaPlay } from 'react-icons/fa';
import { TimerContext } from '../../contexts/TimerContext';

function Timer() {
    const { clockedIn, startTime, elapsedTime, handleClockIn } = useContext(TimerContext);

    function formatElapsedTime(elapsedTime) {
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
    

    function formatStartTime(startTime) {
        if (!startTime) {
            return { hours: '00', minutes: '00', period: 'AM' };
        }

        const date = new Date(startTime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';

        return {
            hours: hours < 10 ? `0${hours}` : hours.toString(),
            minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
            period: period
        };
    }

    const formattedStartTime = formatStartTime(startTime);

    return (
        <div className='mt-8'>
            <div className="flex p-4 items-center bg-gray-500">
                <h4 className="text-xl text-white">
                    {formattedStartTime.hours}:{formattedStartTime.minutes} <sup className="text-sm">{formattedStartTime.period}</sup>
                </h4>
                <div className="flex items-center ml-4" onClick={handleClockIn}>
                    <FaPlayCircle className="text-xl text-white" />
                    <span className="ml-1 text-xl text-white">
                        CLOCK IN
                    </span>
                </div>
            </div>
            <div className='bg-white text-gray-700'>
                <div className="flex justify-between p-4 text-xl">
                    <p>
                        Working Day Duration:
                    </p>
                    <p className='flex items-center'>
                        <FaRegClock className='mr-2' />
                        {formatElapsedTime(elapsedTime)}
                    </p>
                </div>
                <div className='p-4'>
                    <button
                        className="flex items-center py-2 px-4 rounded-md"
                        style={{
                            backgroundColor: clockedIn ? 'rgb(189, 235, 38)' : 'gray',
                        }}
                        onClick={handleClockIn}
                        disabled={clockedIn}
                    >
                        <FaPlay className='mr-2' />
                        <span className="text-xl">
                            CLOCK IN
                        </span>
                    </button>
                    <p className='text-gray-500 text-left'>
                        Change clock-in time
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Timer;
