import styles from '../styles/styles.module.css';

export const SideBar = () => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.navbarContent}>
            <div className={styles.logo}>
                BudgetBuddy
            </div>
            <nav className={styles.navMenu}>
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/expense">Expense</a></li>
                    <li><a href="/income">Income</a></li>
                    <li><a href="/goals">Goals</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </nav>
            </div>
        </div>
    );
};
