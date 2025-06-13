import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { GroupByCategory } from '../utils/helper';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ transactions }) => {
  if (!Array.isArray(transactions)) {
    console.error('Expected an array for transactions, got:', transactions);
    return null;
  }

  const { labels, values } = GroupByCategory(transactions);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#3B1C32',
          '#6A1E55',
          '#A64D79',
          '#EBA6A9',
          '#D7E1F2',
          '#5B5F97',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // 👈 place legend at the bottom
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${labels[tooltipItem.dataIndex]}: ₱${values[tooltipItem.dataIndex]}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '300px', height: '350px', padding: '10px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};
