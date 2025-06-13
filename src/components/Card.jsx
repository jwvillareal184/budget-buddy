import styles from '../styles/styles.module.css';

export const Card = ({cardTitle, children}) => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardTitle}>
                {cardTitle}
            </div>
            <div className={styles.cardBody}>
               {children}
            </div>
        </div>
    )
}