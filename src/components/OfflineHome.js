import { useContext, useState } from "react";
import OfflineTasks from "./OfflineTasks";
import Progress from "./Progress";
import OffTimer from "./OffTimer";
import ScribblePad from "./ScribblePad";
import "../styles/css/offlineHome.css";
import { useHistory } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

const OfflineHome = () => {
  const [doneTasks, setDoneTasks] = useState(0);
  const [doneDeep, setDoneDeep] = useState(0);
  const history = useHistory();
  const { theme, setTheme } = useContext(AuthContext);
 

  return (
    <div className={`wrapper wrapper-${theme}`}>
      <div className="appbar">
        <div className="logo">
        <h2 className="logotext">
          <span className={`logotext1-${theme}`}>Study</span>
          <span className={`logotext2 logotext2-${theme}`}>Pane</span>
        </h2>
        </div>

        <div className="appbar-bttn">
          <button
            className="mebttn"
            onClick={() => {
              history.push("/");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-home"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
          
          <button
            className="themebttn"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
           <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 -1 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-sun"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* <div className="navbar">  this will become like one below   */}
      <div className={`navbar navbar-${theme}`}>
        {/*navbar-light or navbar-dark */}
        <div>
          <h2 className="meeting">Demo Offline Session</h2>
        </div>
        <div>
          <button disabled className="sharebttn">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#000"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-share-2"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
        
      </div>

      <div className="left-container">
        <div className={`tasks tasks-${theme}`}>
          <OfflineTasks setDoneTasks={setDoneTasks} />
        </div>

    
      </div>
      <div className="right-container">
        {/* <div className="rcontchild"> */}
        <div className={`prog prog-${theme}`}>
          <Progress doneTasks={doneTasks} doneDeep={doneDeep} />
        </div>

        <div className={`timer timer-${theme}`}>
          <OffTimer doneDeep={doneDeep} setDoneDeep={setDoneDeep} />
        </div>
        {/* </div> */}

        <div className={`scribble scribble-${theme}`}>
          <ScribblePad />
        </div>
      </div>

      <div className="footie">
        {/* <p>Copyright © TernaryDevs</p>  <--This thing creates an extra div and fucks the balance*/}
        <button disabled className="chatbttn">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 -3 24 24"
              fill="#fff"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              class="feather feather-message-square"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            
          </svg>
          
        </button>
      </div>

      <div className={`credit credit-${theme}`}>
        Developed by  <a href="https://github.com/Isen-kun/exhibit2021-studypane" target="_blank" className="td">TernaryDevs</a>
      </div>
    </div>
  );
};

export default OfflineHome;
