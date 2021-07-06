import { useState } from "react";
import OfflineTasks from "./OfflineTasks";
import Progress from "./Progress";
import Timer from "./Timer";
import ScribblePad from "./ScribblePad";
import "../styles/css/offlineHome.css";

const OfflineHome = () => {
  const [doneTasks, setDoneTasks] = useState(0);
  const [doneDeep, setDoneDeep] = useState(0);
  const [tbd, setTbd] = useState(0);
  return (
    <div className="wrapper">
      <header className="appbar">
        <div className="logo">
          <h3>StudyPane</h3>
        </div>

        <div className="appbar-bttn">
          <button className="mebttn">My Account</button>
          <button className="solobttn" disabled>
            Co-Op
          </button>
          <button className="themebttn">Theme</button>
        </div>
      </header>

      <nav className="navbar">
        <div>
          <h3>Demo Offline Session</h3>
        </div>
        <div>
          <button disabled className="sharebttn">
            Share
          </button>
        </div>
        {/* <a className="sharebttn">Share</a> */}
      </nav>

      <div className="left-container">
        <div className="tasks">
          <OfflineTasks setDoneTasks={setDoneTasks} setTbd={setTbd} />
        </div>
        {/* <div className="board" >
          <Timer/>
        </div> */}
      </div>

      <div className="right-container">
        <div className="rcontchild">
          <div className="prog">
            <Progress doneTasks={doneTasks} doneDeep={doneDeep} />
          </div>

          <div className="timer">
            <Timer doneDeep={doneDeep} setDoneDeep={setDoneDeep} />
          </div>
        </div>

        <div className="scribble">
          <ScribblePad />
        </div>
      </div>

      <div className="footie">
        {/* <p>Copyright © TernaryDevs</p>  <--This thing creates an extra div and fucks the balance*/}
        <button disabled className="chatbttn">
          M
        </button>
      </div>
      <div className="credit">
        <p>
          Copyright © <a className="td">TernaryDevs</a>
        </p>
      </div>
    </div>
  );
};

export default OfflineHome;