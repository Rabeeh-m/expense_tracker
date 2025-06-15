import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ summary }) => {
  // Generate grayscale colors based on category count
  const generateGrayscaleColors = (count) => {
    const colors = [];
    const baseIncrement = 100 / (count + 1); // Ensure we don't get pure black/white
    
    for (let i = 1; i <= count; i++) {
      const shade = Math.floor(baseIncrement * i);
      colors.push(`hsl(0, 0%, ${shade}%)`);
    }
    
    return colors;
  };

  const data = {
    labels: summary.map((item) => item.category.toUpperCase()),
    datasets: [
      {
        data: summary.map(item => item.total),
        backgroundColor: generateGrayscaleColors(summary.length),
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderColor: '#000',
        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: 'sans-serif',
            size: 12,
            weight: '500'
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { weight: 'normal', size: 14 },
        bodyFont: { weight: 'bold', size: 14 },
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ₹${value.toFixed(2)}`;
          }
        }
      }
    },
    cutout: summary.length > 3 ? '60%' : '50%' // Adjust based on category count
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">SPENDING BY CATEGORY</h3>
      </div>
      <div className="relative h-64 sm:h-80 md:h-96">
        <Pie 
          data={data} 
          options={options}
          aria-label="Expense categories chart"
        />
      </div>
    </div>
  );
};

export default ExpenseChart;