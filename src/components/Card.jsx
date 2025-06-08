import styles from '../styles/styles.module.css';

export const Card = () => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.weeklyIncomeDesc}>
                Total Income weekly
            </div>
            <div className="incomeDiv">
                12000
            </div>
        </div>
    )
}