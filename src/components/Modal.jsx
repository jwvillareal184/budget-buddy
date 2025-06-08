import styles from '../styles/styles.module.css';

export const Modal = ({isOpen, onClose, title, children}) => {
    if (!isOpen) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
               <div>
               {title && <h2 className={styles.maodalTitle}>{title}</h2>}
               </div>
                <div className={styles.modalBody}>{children}</div>
            </div>
        </div>
    )
}