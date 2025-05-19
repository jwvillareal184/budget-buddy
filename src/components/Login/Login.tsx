import './Login.css';

export function Login() {
    return(
        <div>
            <div>
                <div>Login</div>
                <form>
                    <div>
                        <input type='email' required />
                    </div>
                    <div>
                        <input type='password' required />
                    </div>
                    
                    <div>
                        <button>Log in</button>
                    </div>
                </form>
                <div>Don't have account yet?</div>
                <div>Forgot your password?</div>
            </div>
        </div>
    );
}