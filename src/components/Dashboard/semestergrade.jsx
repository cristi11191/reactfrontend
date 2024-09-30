import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';  // Importing chart.js

const SemesterGrade = () => {
    const chartRef = useRef(null);  // Reference to store the chart instance
    const data = {
        labels: ['SEM 1', 'SEM 2', 'SEM 3', 'SEM 4', 'SEM 5', 'SEM 6'],
        datasets: [
            {
                label: 'Grade',
                data: [8, 7, 5, 5, 5, 0],
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    useEffect(() => {
        // If a chart instance exists, destroy it before creating a new one
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create a new chart instance
        chartRef.current = new Chart(document.getElementById('grade-chart'), {
            type: 'line',
            data: data,
        });

        // Cleanup function to destroy the chart instance when component unmounts
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data]);  // Add 'data' as a dependency so the chart updates when data changes

    return (
        <div style={{width: 500, height: 400}}>
            <canvas id="grade-chart"></canvas>
        </div>
    );
};

export default SemesterGrade;
