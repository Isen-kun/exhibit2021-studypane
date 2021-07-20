import { useContext, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import useFirestoreRoom from "../hooks/useFirestoreRoom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Progress from "./Progress";
import OnTasks from "./OnTasks";
import OnTimer from "./OnTimer";
import ScribblePad from "./ScribblePad";
import Messaging from "./Messaging";
// import LeaderBoard from "./LeaderBoard";
import { projectFirestore, timestamp } from "../Firebase/config";
import "../styles/css/offlineHome.css";

const OnHome = () => {
  const { roomId, setRoomId, currentUser, theme, setTheme } =
    useContext(AuthContext);
  const { docs } = useFirestoreRoom();
  const [roomDetails, setRoomDetails] = useState({});
  const [shareModal, setShareModal] = useState(false);
  const [doneTasks, setDoneTasks] = useState(0);
  const [doneDeep, setDoneDeep] = useState(0);
  const [confModal, setConfModal] = useState(false);
  const [messagingModal, setMessagingModal] = useState(false);
  const history = useHistory();
  const admin = roomDetails.ownerId === currentUser.uid ? true : false;

  const handleKill = () => {
    setRoomId("");
  };

  useEffect(() => {
    if (roomId === "") {
      history.push("/Dashboard");
    }
    docs.forEach((room) => {
      if (room.id === roomId) {
        setRoomDetails(room);
      }
    });
  });

  const handleSessionUpdate = (time) => {
    projectFirestore.collection("rooms").doc(roomId).update({
      DeepworkTimeSetByAdmin: time,
    });
  };

  const handleRestUpdate = (time) => {
    projectFirestore.collection("rooms").doc(roomId).update({
      RestTimeSetByAdmin: time,
    });
  };

  const handleSyncStart = () => {
    projectFirestore.collection("rooms").doc(roomId).update({
      SyncedSessionStart: !roomDetails.SyncedSessionStart,
    });
  };

  const handleSyncReset = () => {
    projectFirestore.collection("rooms").doc(roomId).update({
      SyncedSessionReset: !roomDetails.SyncedSessionReset,
    });
  };

  const addDoneDeep = () => {
    projectFirestore.collection("sessions").add({
      ownerId: currentUser.uid,
      roomId: roomId,
      time: roomDetails.DeepworkTimeSetByAdmin,
      createdAt: timestamp(),
    });
  };

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
              setConfModal(true);
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
          {confModal && (
            <div className="quitmodal">
              <p>Do you really want to exit the room?</p>
              <p>
                <button className="dashbttn" onClick={handleKill}>Yes</button>
                <button  className="dashbttn"
                  onClick={() => {
                    setConfModal(false);
                  }}
                >
                  No
                </button>
              </p>
            </div>
          )}

          <button
            className="themebttn"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
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

      <div className={`navbar navbar-${theme}`}>
        <div>
          <h2 className="meeting">{roomDetails.title}</h2>
        </div>
        <div>
          {/* <button className="sharebttn">Share Room details</button> */}
          <button
            className="sharebttn"
            onClick={() => {
              setShareModal(!shareModal);
            }}
          >
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
          {shareModal && (
            <div className="sharemodal">
              <h4>Copy this code to share with others</h4>
              <input disabled value={roomId} />
              <CopyToClipboard
                text={roomId}
                // onCopy={() => this.setState({ copied: true })}
              >
                <button>Copy</button>
              </CopyToClipboard>
              <div>
                <button onClick={() => setShareModal(false)}>Close</button>
              </div>
            </div>
          )}
          {/* <button onClick={handleKill}>End</button> */}
        </div>
        {/* <a className="sharebttn">Share</a> */}
      </div>

      <div className="left-container">
        {/* <div className="board">
          <button 
            onClick={() => {
              setMessagingModal(!messagingModal);
            }}>Click here
            
          </button> */}

        {/* </div>  */}

        <div className={`tasks tasks-${theme}`}>
          <OnTasks setDoneTasks={setDoneTasks} />
        </div>
      </div>

      <div className="right-container">
        {/* <div className="rcontchild"> */}
        {/* <div className="tasks">
          <OnTasks setDoneTasks={setDoneTasks} />
        </div>- */}
        <div className={`prog prog-${theme}`}>
          <Progress doneTasks={doneTasks} doneDeep={doneDeep} />
        </div>
        <div className={`timer timer-${theme}`}>
          <OnTimer
            doneDeep={doneDeep}
            setDoneDeep={setDoneDeep}
            admin={admin}
            sessionLength={roomDetails.DeepworkTimeSetByAdmin}
            breakLength={roomDetails.RestTimeSetByAdmin}
            currentUser={currentUser}
            handleSessionUpdate={handleSessionUpdate}
            handleRestUpdate={handleRestUpdate}
            handleSyncStart={handleSyncStart}
            syncTrigger={roomDetails.SyncedSessionStart}
            handleSyncReset={handleSyncReset}
            syncReset={roomDetails.SyncedSessionReset}
            addDoneDeep={addDoneDeep}
          />
        </div>
        <div className={`scribble scribble-${theme}`}>
          <ScribblePad />
        </div>
      </div>

      <div className="footie">
        <button
          className="chatbttn"
          onClick={() => {
            setMessagingModal(!messagingModal);
          }}
        >
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

        {messagingModal && (
          <div className="modalbox">
            <div className="msg">
              <Messaging />
            </div>
          </div>
        )}
      </div>

      <div className={`credit credit-${theme}`}>
        Copyright © <a className="td">TernaryDevs</a>
      </div>
    </div>
  );
};

export default OnHome;
