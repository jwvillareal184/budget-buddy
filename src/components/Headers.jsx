import styles from './styles.module.css';

export const Headers = ({label='', className=''}) => {
    return (
        <div className={`${styles.header} ${className}`}>{label}</div>
    )
} 