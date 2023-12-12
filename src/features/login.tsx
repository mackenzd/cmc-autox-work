interface LoginProps {
    onClick: () => void;
}

const Login = (props: LoginProps) => {
    return (
        <div>
            <button className="btn login-btn" onClick={props.onClick}>Login with <img src="https://msr-hotlink.s3.amazonaws.com/default/msr-logo-default.png" /></button>
        </div>
    )
}

export default Login