import {useState} from 'react';
import styles from './styles.module.css';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

export const Modal = ({isOpen, onClose, title, children}) => {
    if (!isOpen) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {title && <h2 className={styles.maodalTitle}>{title}</h2>}
                <div className={styles.modalBody}>{children}</div>
            </div>
        </div>
    )
}