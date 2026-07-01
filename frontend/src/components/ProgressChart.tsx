import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProgressChartProps {
  dataPoints: { date: string; score: number }[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ dataPoints }) => {
  // Format labels and data values
  const labels = dataPoints.map((dp) => {
    try {
      const d = new Date(dp.date);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return dp.date;
    }
  });
  const scores = dataPoints.map((dp) => dp.score);

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Overall Score',
        data: scores,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: {
          family: 'Inter',
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          family: 'Inter',
          size: 12,
        },
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11,
          },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.15)',
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 11,
          },
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="bg-card border rounded-3xl p-6 shadow-md w-full h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Progress Chart</h3>
          <p className="text-xs text-muted-foreground">Historical assessment accuracy tracking</p>
        </div>
      </div>
      <div className="w-full h-[230px]">
        {dataPoints.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
            No assessment history available yet. Start practicing!
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
export { ProgressChart };
