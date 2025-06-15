import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faRightFromBracket,
  faUser,
  faCircleUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const goToProfile = () => {
    navigate('/profile');
    setMenuOpen(false);
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.navbarContent}>
        <div className={styles.logo}>BudgetBuddy</div>

        {/* Burger icon (only visible on small screens) */}
        <button
          className={styles.burgerButton}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>

        {/* Desktop Menu */}
        <nav className={styles.navMenu}>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/expenses">Expense</Link></li>
            <li><Link to="/income">Income</Link></li>
            <li><Link to="/goals">Goals</Link></li>
          </ul>
        </nav>

        {/* User dropdown only for desktop */}
        <div className={styles.userMenuWrapper}>
          <FontAwesomeIcon icon={faCircleUser} className={styles.userIcon} />
          <div className={styles.userDropdown}>
            <button onClick={goToProfile}>
              <FontAwesomeIcon icon={faUser} /> Profile
            </button>
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (shown when burger is clicked) */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/expenses" onClick={() => setMenuOpen(false)}>Expense</Link>
          <Link to="/income" onClick={() => setMenuOpen(false)}>Income</Link>
          <Link to="/goals" onClick={() => setMenuOpen(false)}>Goals</Link>
          <button onClick={goToProfile}>
            <FontAwesomeIcon icon={faUser} /> Profile
          </button>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
