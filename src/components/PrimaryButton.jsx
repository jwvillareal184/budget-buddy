import styles from '../styles/styles.module.css';

export const PrimaryButton = ({label, onClick, type='button', className=''}) => {
    return(
        <button className={`${styles.primarybtn} ${className}`} type={type} onClick={onClick}>
            {label}
        </button>
    )
}