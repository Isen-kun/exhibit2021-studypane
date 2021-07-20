import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Stats from "./Stats";
import { projectFirestore, timestamp } from "../Firebase/config";
import "../styles/css/stats.css";
 
const Dashboard = () => {
  const { currentUser, signout, setProfile, roomId, setRoomId } =
    useContext(AuthContext);
 
  const [roomAdder, setRoomAdder] = useState(false);
  const [room, setRoom] = useState("");
  const [joinRoomModal, setJoinRoomModal] = useState(false);
  const [nickAdder, setNickAdder] = useState(false);
  const [nick, setNick] = useState("");
  const [nickEditAdder, setNickEditAdder] = useState(false);
  const [editNick, setEditNick] = useState("");
  const [roomError, setRoomError] = useState(false);
  const history = useHistory();
 
  const handleLogOut = () => {
    signout();
  };
 
  const handleUpdateName = () => {
    if (nick === "") {
      setProfile(editNick);
      // window.location.reload();
    } else {
      setProfile(nick);
    }
 
    setNick("");
    setEditNick("");
    setNickAdder(false);
    setNickEditAdder(false);
  };
 
  const handleAddRoom = () => {
    projectFirestore
      .collection("rooms")
      .add({
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName,
        title: room,
        createdAt: timestamp(),
        DeepworkTimeSetByAdmin: 25,
        RestTimeSetByAdmin: 5,
        SyncedSessionStart: false,
        SyncedSessionReset: false,
        // SyncedBreakStart: false,
        // timerStatus: "",
      })
      // .then(history.push("/Onhome"));
      .then((docRef) => {
        setRoomId(docRef.id);
        history.push("/Onhome");
      });
  };
 
  const handleJoinRoom = async () => {
    const roomRef = projectFirestore.collection("rooms").doc(roomId);
    const doc = await roomRef.get();
    if (!doc.exists) {
      setRoomError(true);
      setRoomId("");
    } else {
      history.push("/Onhome");
    }
    setJoinRoomModal(false);
  };
 
  useEffect(() => {
    if (currentUser === null) {
      history.push("/");
    }
  });
 
  return (
    <div>
      {currentUser && (
        <div>
          <h1>Dashboard</h1>
          {currentUser.displayName ? (
            <div>
              <p>Nickname: {currentUser.displayName}</p>
              <p>
                <button className="dashbttn" onClick={() => setNickEditAdder(true)}>
                  Edit nickname
                </button>
              </p>
            </div>
          ) : (
            <button className="dashbttn" onClick={() => setNickAdder(true)}>Add a nickname</button>
          )}
          {nickAdder && (
            <div className="dashmodal">
              
              <input
                type="text"
                required
                value={nick}
                onChange={(e) => {
                  setEditNick(e.target.value);
                }}
              />
              <button  className="dashbttn" onClick={handleUpdateName}>Add</button>
              <button className="dashbttn" onClick={() => setNickAdder(false)}>Close</button>
            </div>
          )}
          {nickEditAdder && (
            <div className="dashmodal">
              <p>
                <input
                  placeholder="Enter your nickname"
                  className="dashinput"
                  type="text"
                  required
                  value={editNick}
                  onChange={(e) => {
                    setEditNick(e.target.value);
                  }}
                />
                <button  className="dashbttn" onClick={handleUpdateName}>Save</button>
              </p>
              <p><button  className="dashbttn" onClick={() => setNickEditAdder(false)}>Close</button></p>
            </div>
          )}
          <p>Currently Signed in as: {currentUser.email}</p>
          <div style={{textAlign:"center"}}>
            
            <button className="dashbttn" onClick={handleLogOut}>Logout</button>
            <button className="dashbttn" onClick={() => {setRoomAdder(true);setJoinRoomModal(false)}}>Start a Room</button>
            {roomAdder && (
              <div className="dashmodal">
                <button  className="dashbttn" onClick={() => setRoomAdder(false)}>Close</button>
                <input
                  placeholder="Name Your Room"
                  type="text"
                  className="dashinput"
                  required
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
                <button className="dashbttn" onClick={handleAddRoom}>Add</button>
              </div>
            )}
 
            <button className="dashbttn" onClick={() => {setJoinRoomModal(true); setRoomAdder(false)}}>Join a Room</button>
            {joinRoomModal && (
              <div className="dashmodal">
                <button className="dashbttn" onClick={() => setJoinRoomModal(false)}>Close</button>
                <input
                placeholder="Input Shared Code"
                  type="text"
                  required
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <button className="dashbttn" onClick={handleJoinRoom}>Join</button>
              </div>
            )}
            {roomError && <p>Sorry no such rooms found, try creating one.</p>}
          </div>
          <div>
            <Stats />
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Dashboard;