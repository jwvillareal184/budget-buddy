import styles from '../styles/styles.module.css';

export const Loader = () => (
  <div className={styles.loaderOverlay}>
    <div className={styles.spinner}></div>
  </div>
);
