import { useUser } from '../../context/UserContext';
import { Headers } from '../../components';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className='dashboard'>
      <Headers label='Dashboard'/>
      {user ? (
        <div>
        <div className="row">
            <div className="greetings">
                Welcome back, <span className="username">{user.fname}!</span>
              </div>
              <div className="currentWeather">
                <div>Weather for today</div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="row">Balance</div>
                <div className="row">Income</div>
                <div className="row">Expense</div>
                <div className="row">Goal</div>
              </div>
              <div className="col">CHART EXPENSE VS INCOME</div>
            </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
