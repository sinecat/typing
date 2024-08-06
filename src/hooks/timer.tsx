import { useState, useEffect, useRef } from 'react';

const useTimer = () => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const startTimeRef = useRef(0);
    const elapsedTimeRef = useRef(0);
    const requestRef = useRef<any>(null);

    const updateTimer = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current + elapsedTimeRef.current;
        setTime(Math.floor(elapsed / 1000));
        requestRef.current = requestAnimationFrame(updateTimer);
    };

    const start = () => {
        if (!isActive) {
            setIsActive(true);
            setIsPaused(false);
            startTimeRef.current = 0;
            requestRef.current = requestAnimationFrame(updateTimer);
        } else if (isPaused) {
            // Continue from where it was paused
            setIsPaused(false);
            startTimeRef.current = 0;
            requestRef.current = requestAnimationFrame(updateTimer);
        }
    };

    const pause = () => {
        if (isActive && !isPaused) {
            setIsPaused(true);
            elapsedTimeRef.current += performance.now() - startTimeRef.current;
            cancelAnimationFrame(requestRef.current);
        }
    };

    const reset = () => {
        setIsActive(false);
        setIsPaused(false);
        setTime(0);
        startTimeRef.current = 0;
        elapsedTimeRef.current = 0;
        cancelAnimationFrame(requestRef.current);
    };

    const end = () => {
        setIsActive(false);
        setIsPaused(false);
        cancelAnimationFrame(requestRef.current);
    };

    useEffect(() => {
        if (isActive && !isPaused) {
            requestRef.current = requestAnimationFrame(updateTimer);
        } else if (isPaused || !isActive) {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isActive, isPaused]);

    return { time, start, pause, reset, end };
};

export default useTimer;
