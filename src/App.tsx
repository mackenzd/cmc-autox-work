import { Outlet } from 'react-router-dom'
import './App.css';
import { useMemo, useState } from 'react';
import Login from './features/login';
import Logout from './features/logout';


function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const pageContent = useMemo(
    () =>
      loggedIn ? (
        <>
          <Outlet />
          <Logout onClick={() => setLoggedIn(false)} />
        </>
      ) : (
        <Login onClick={() => setLoggedIn(true)} />
      ), [loggedIn]
  )

  return (
   <div className="root">
    <div className="navbar bg-base-100">
      <a href="/home" className="p-3 font-semibold no-animation text-xl">Cumberland Motor Club Work Assignments</a>
    </div>
    <div className="content">
      {pageContent}
    </div>
    <div className="msr-logo">
      <a href="https://motorsportreg.com" style={{display: "inline-block", padding: "15px"}}>
        <img
          src="https://msr-hotlink.s3.amazonaws.com/powered-by/powered-by-msr-outline@2x.png"
          alt="Online registration and event management service for motorsport events powered by MotorsportReg.com"
          title="Online registration and event management service for motorsport events powered by MotorsportReg.com"
          style={{width: "165px", height: "29px"}} />
      </a>
    </div>
   </div>
  );
}

export default App;

