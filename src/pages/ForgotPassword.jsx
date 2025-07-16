import {FloatingLabelInput, PrimaryButton, Card} from '../components'

export function ForgotPassword() {
    return(
        <div className='forgot-password'>
            Forgot Password
            <FloatingLabelInput label="Email" />
            <PrimaryButton label="Send to my email"/>
        </div>
    );
}