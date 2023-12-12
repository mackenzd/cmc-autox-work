interface LogoutProps {
    onClick: () => void;
}

const Logout = (props: LogoutProps) => {
    return (
        <div>
            <button className="btn logout-btn" onClick={props.onClick}>Logout</button>
        </div>
    )
}

export default Logout