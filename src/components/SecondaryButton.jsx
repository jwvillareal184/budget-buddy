import styles from './styles.module.css'

export const SecondaryButton = ({label, onClick, type='button', className=''}) => {
    return(
        <button className={`${styles.secondarybtn} ${className}`} type={type} onClick={onClick}>
            {label}
        </button>
    )
}