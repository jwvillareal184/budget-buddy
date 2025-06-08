import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/styles.module.css';

export function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.navbarContent}>
        <div className={styles.logo}>
          BudgetBuddy
        </div>
        <nav className={styles.navMenu}>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/expenses">Expense</a></li>
            <li><a href="/income">Income</a></li>
            <li><a href="/goals">Goals</a></li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
