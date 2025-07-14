import styles from '../styles/styles.module.css';

export const WhiteHeaders = ({label='', className=''}) => {
    return (
        <div className={`${styles.whiteHeader} ${className}`}>{label}</div>
    )
} 