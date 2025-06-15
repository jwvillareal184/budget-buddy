import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Headers, Carousel } from '../components';
import {fetchGoals,fetchTransactions} from '../services';
import '../styles/styles.css';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import greetings from '../assets/greetings.svg';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

export const Dashboard = () => {
  const { user } = useUser();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [incomes, setIncomes] = useState('');
  const [expenses, setExpenses] = useState('');
  const [goalData, setGoalData] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const balance = incomes - expenses;


  const fetchMontlyGoals = async () => {
    const goals = await fetchGoals(user._id);
    setGoalData(goals);
  };

  const fetchMonthlyTransaction = async () => {
    if (!user) return;

    const all = await fetchTransactions(user._id);
    const monthlyMap = {};

    all.forEach((t) => {
      const date = new Date(t.dateCreated);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${String(month).padStart(2, '0')}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = { income: 0, expense: 0 };
      }

      const amount = Number(t.amount) || 0;

      if (t.transacType === 'income') {
        monthlyMap[key].income += amount;
      } else if (t.transacType === 'expense') {
        monthlyMap[key].expense += amount;
      }
    });

    const sortedKeys = Object.keys(monthlyMap).sort();

    const labels = sortedKeys.map((key) => {
      const [year, month] = key.split('-');
      return new Date(year, month).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
    });

    const incomeData = sortedKeys.map((key) => monthlyMap[key].income);
    const expenseData = sortedKeys.map((key) => monthlyMap[key].expense);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#6A1E55',
          backgroundColor: 'rgba(106, 30, 85, 0.2)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Expense',
          data: expenseData,
          borderColor: '#A64D79',
          backgroundColor: 'rgba(166, 77, 121, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    });

    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(
      now.getMonth()
    ).padStart(2, '0')}`;
    const thisMonth = monthlyMap[currentKey] || { income: 0, expense: 0 };

    setIncomes(thisMonth.income);
    setExpenses(thisMonth.expense);

    const sorted = [...all].sort(
      (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
    );
    setAllTransactions(sorted);
  };

  useEffect(() => {
    if (!user?._id) return;
  
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchMontlyGoals(),
          fetchMonthlyTransaction(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchAllData();
  }, [user?._id]);
  

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = allTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);

  return (
    <div className="Dashboard">
      {user ? (
        <div className="dashboard-content">
          <div className="row-greetings">
            <div className="greetings-container">
              <Headers label={`Welcome, ${user.fname}!`} />
              <img
                src={greetings}
                alt="greetings-img"
                className="greetings-img"
              />
            </div>
          </div>

          <div className="row-line-progress-chart">
            <div className="lineChart">
              <Line
                style={{height: '220px' }}
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Monthly Income vs Expense',
                    },
                  },
                }}
              />
            </div>
            <div className="goal-carousel" >
              <Carousel goals={goalData} />
            </div>
          </div>

          <div className="row-numbers">
            <div className="numbers">
              Monthly Balance
              <Headers label={`₱${balance.toFixed(2)}`} />
            </div>
            <div className="numbers">
              Monthly Income
              <Headers label={`₱${incomes}`} />
            </div>
            <div className="numbers">
              Monthly Expense
              <Headers label={`₱${expenses}`} />
            </div>
          </div>

          <div className="table-container transaction-table">
            <Headers label="Recent Transactions" />
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((t, index) => {
                  const sign = t.transacType === 'income' ? '+' : '-';
                  const color = t.transacType === 'income' ? 'green' : 'red';

                  return (
                    <tr key={index}>
                      <td className='desc'>{t.description}</td>
                      <td style={{ color }}>
                        {`${sign}₱${parseFloat(t.amount).toFixed(2)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
