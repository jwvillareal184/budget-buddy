import {useState, useEffect} from 'react';
import { useUser } from '../../context/UserContext';
import { Headers } from '../../components';
import { weatherServices, getLocationDetails, fetchGoals, fetchTransactions } from '../../services'; 
import '../../styles/styles.css';
import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register( CategoryScale, LinearScale, PointElement,LineElement, Title, Tooltip, Legend );

export const Dashboard = () => {
  const { user } = useUser();
  console.log(user)
  const [chartData, setChartData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [country, setCountry] = useState('');
  const [condition, setCondition] = useState('');
  const [incomes, setIncomes] = useState('');
  const [expenses, setExpenses] = useState('');
  const balance = incomes - expenses;



  const fetchWeatherAndLocation = async () => {
    try {
      const weatherData = await weatherServices();

      const lat = weatherData.location.lat;
      const lon = weatherData.location.lon;

      const today = weatherData.timelines.daily[0].values;
      const countryName = await getLocationDetails(lat, lon);

      const weatherCodeMap = {
        1000: 'Clear',
        1001: 'Cloudy',
        1100: 'Mostly Clear',
        1101: 'Partly Cloudy',
        4000: 'Drizzle',
        4001: 'Rain',
        4200: 'Light Rain',
        4201: 'Heavy Rain',
      };

      setWeather(today);
      setCountry(countryName);
      setCondition(weatherCodeMap[today.weatherCodeMax]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMontlyGoals = async () => {
    const goalData = await fetchGoals(user._id);
    console.log('goals', goalData);
  }

  const fetchMonthlyTransaction = async () => {
    if (!user) return;
  
    const allTransactions = await fetchTransactions(user._id);
  
    const monthlyMap = {};
  
    allTransactions.forEach((t) => {
      const date = new Date(t.dateCreated);
      const monthIndex = date.getMonth(); // 0 - 11
      const year = date.getFullYear();
      const key = `${year}-${monthIndex}`; // ensure unique by year
  
      if (!monthlyMap[key]) {
        monthlyMap[key] = { income: 0, expense: 0 };
      }
  
      if (t.transacType === 'income') {
        monthlyMap[key].income += Number(t.amount);
      } else if (t.transacType === 'expense') {
        monthlyMap[key].expense += Number(t.amount);
      }
    });
  
    // Convert map to sorted arrays
    const sortedKeys = Object.keys(monthlyMap).sort(); // sorts by year-month
    const labels = sortedKeys.map((key) => {
      const [year, month] = key.split('-');
      return new Date(year, month).toLocaleString('default', { month: 'short' }); // e.g., Jan
    });
  
    const incomeData = sortedKeys.map(key => monthlyMap[key].income);
    const expenseData = sortedKeys.map(key => monthlyMap[key].expense);
  
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
  
    // Optionally: for current month totals
    const now = new Date();
    const nowKey = `${now.getFullYear()}-${now.getMonth()}`;
    const thisMonth = monthlyMap[nowKey] || { income: 0, expense: 0 };
    setIncomes(thisMonth.income);
    setExpenses(thisMonth.expense);
  };
  
  useEffect(() => {
    if (!user) return; // 👈 make sure user exists
    fetchWeatherAndLocation();
    fetchMontlyGoals();
    fetchMonthlyTransaction();
  }, [user]);

  return (
    <div className='Dashboard'>
      <Headers label='Dashboard'/> 
      {user ? (
        <div className='dashboard-content'>
        <div className="row">
            <div className="greetings-container">
                Welcome back, <span className="username">{user.fname}!</span>
              </div>
              <div className="current-weather">
                <div>Weather for today</div>
                <div className="">{country}</div>
                <p><strong>Max Temp:</strong> {weather?.temperatureMax}°C</p>
                <p><strong>Min Temp:</strong> {weather?.temperatureMin}°C</p>
                <p><strong>Condition:</strong> {condition}</p>
              </div>
            </div>
            <div className="row">
              <div className="col">
              <div className="row numbers">
                Monthly Balance
                <Headers label={`₱${balance.toFixed(2)}`} />
              </div>
              <div className="row numbers">
                Monthly Income
                <Headers label={`₱${incomes}`} />
              </div>
              <div className="row numbers">
                Monthly Expense
                <Headers label={`₱${expenses}`} />
              </div>

                <div className="row numbers"><Headers label='Goal' /></div>
              </div>
          
                  {chartData ? (
                    <div className="lineChart">
                      <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Monthly Income vs Expense',
                          },
                        },
                      }}
                    />
                    </div>
                  ) : (
                    <p>Loading chart...</p>
                  )}
                </div>

            </div>
    
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
