import React, { useEffect, useState } from 'react';

const Timer = ({ onTimeout }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime((prev) => {
                if (prev >= 50) {
                    clearInterval(timerId);
                    onTimeout && onTimeout();
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [onTimeout]);

    return `${time} seconds`;
};

export default Timer;
