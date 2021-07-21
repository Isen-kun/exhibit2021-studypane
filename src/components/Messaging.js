import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { projectFirestore, timestamp } from "../Firebase/config";
import useFirestoreMessage from "../hooks/useFirestoreMessage";
import "../styles/css/messaging.css";

const Messaging = () => {
  const { currentUser, roomId } = useContext(AuthContext);
  const { docs } = useFirestoreMessage(currentUser);
  const [formValue, setFormValue] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();

    await projectFirestore.collection("messages").add({
      text: formValue,
      ownerId: currentUser.uid,
      ownerName: currentUser.displayName,
      roomId: roomId,
      type: "message",
      createdAt: timestamp(),
    });

    setFormValue("");
  };
  return (
    <div>
{/*       
        {docs.map((message) => {
          if (message.type === "status" && message.roomId === roomId)
            return (
              <p>
                {message.ownerName} completed {message.taskNo}th task.
              </p>
            );
          else return null;
        })}
       */}
      <div>
        <div><p><h3 className="chatheader">Messages:</h3></p></div>
        
        <div className="chatdiv">
          {docs.map((message) => {
            const messageClass =
              message.ownerId === currentUser.uid ? "sent" : "recieved";
            if (message.type === "message" && message.roomId === roomId )
              return (
                <>
                  <div className={`xyzClass ${messageClass}`}>
                    <p className="textsender"><b>{message.ownerName} said:</b></p>
                    <p className="chattext">{message.text}</p>
                  </div>
    
        
                </>
              );
            else return null;
          })}
          <div className="chatinput">
            <form onSubmit={handleSend}>
              <input
                className="chatinputbox"
                type="text"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="Type your message here..."
              />
              <button className="bttn" type="submit"><b>Send</b></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
