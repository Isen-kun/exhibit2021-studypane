import { useEffect, useState, useContext } from "react";
import { projectFirestore, timestamp } from "../Firebase/config";
import TaskForm from "./TaskForm";
import OnTaskList from "./OnTaskList";
import { AuthContext } from "../contexts/AuthContext";
import useFirestoreTask from "../hooks/useFirestoreTask";
import "../styles/css/tasks.css";

const OnTasks = ({ setDoneTasks }) => {
  const { currentUser, roomId } = useContext(AuthContext);
  const { docs } = useFirestoreTask(currentUser.uid);
  // const [tasks, setTasks] = useState([]);
  const [taskNo, setTaskNo] = useState(0);
  const [open, setOpen] = useState(false);

  const handleAddTask = (e, input) => {
    e.preventDefault();
    projectFirestore.collection("tasks").add({
      title: input,
      ownerId: currentUser.uid,
      room: roomId,
      status: false,
      createdAt: timestamp(),
      ownerName: currentUser.displayName,
    });
    e.target.reset();
    setOpen(false);
  };

  const handleComplete = (selectedTask) => {
    projectFirestore.collection("tasks").doc(selectedTask.id).update({
      status: !selectedTask.status,
    });
    if (!selectedTask.status) {
      projectFirestore.collection("messages").add({
        type: "status",
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName,
        roomId: roomId,
        taskNo: taskNo + 1,
        createdAt: timestamp(),
      });
    }
  };

  const handleDelete = (id) => {
    projectFirestore.collection("tasks").doc(id).delete();
  };

  useEffect(() => {
    var cnt = 0;
    docs.forEach((task) => {
      if (
        task.room === roomId &&
        task.status &&
        task.ownerId === currentUser.uid
      ) {
        cnt += 1;
      }
    });
    setDoneTasks(cnt);
    setTaskNo(cnt);

    // docs.forEach((task) => {
    //   if (task.room === roomId && task.ownerId === currentUser.uid) {
    //     setTasks([...tasks, task]);
    //   }
    // });
  }, [docs]);

  return (
    <>
      <h4>Your Tasks:</h4>
      <OnTaskList
        tasks={docs}
        handleDelete={handleDelete}
        handleComplete={handleComplete}
        roomId={roomId}
        currentUser={currentUser}
      />

      {!open && (
        <div className="addtaskbttn">
        <button
          className="bttn"
          onClick={() => {
            setOpen(true);
          }}>
          
          <p><b>Add task</b></p>
        </button>
      </div>
      )}
      <div className="modal" style={{ display: open ? "block" : "none" }}>
        <button
          className="bttn"
          onClick={() => {
            setOpen(false);
          }}
        >
          <b>Close</b>
        </button>
        <TaskForm handleAddTask={handleAddTask} />
      </div>
    </>
  );
};

export default OnTasks;
