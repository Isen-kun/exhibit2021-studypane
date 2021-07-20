import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import useFirestoreStatsTasks from "../hooks/useFirestoreStatsTasks";
import useFirestoreStatsSession from "../hooks/useFirestoreStatsSessions";
import { convertTimestamp } from "convert-firebase-timestamp";
import { Bar } from "react-chartjs-2";
import "../styles/css/stats.css";

const Stats = () => {
  const { currentUser } = useContext(AuthContext);
  const { tasks } = useFirestoreStatsTasks(currentUser.uid, "tasks");
  const { sessions } = useFirestoreStatsSession(currentUser.uid, "sessions");

  const [taskDate, setTaskDate] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [sessionDate, setSessionDate] = useState([]);
  const [sessionCounts, setSessionCounts] = useState({});
  const [sessionMinutes, setSessionMinutes] = useState(0);

  useEffect(() => {
    const temp1 = [];
    tasks.forEach((task) => {
      if (task.status) {
        // temp.push(task["createdAt"]);
        temp1.push(String(convertTimestamp(task["createdAt"])).slice(4, 15));
        setTaskDate(temp1);
      }
    });

    const temp2 = {};
    taskDate.forEach(function (x) {
      temp2[x] = (temp2[x] || 0) + 1;
    });
    setTaskCounts(temp2);

    const temp3 = [];
    sessions.forEach((session) => {
      // temp.push(task["createdAt"]);
      temp3.push(String(convertTimestamp(session["createdAt"])).slice(4, 15));
      setSessionDate(temp3);
    });

    const temp4 = {};
    sessionDate.forEach(function (x) {
      temp4[x] = (temp4[x] || 0) + 1;
    });
    setSessionCounts(temp4);

    let cnt = 0;
    sessions.forEach((session) => {
      cnt += session.time;
    });
    setSessionMinutes(cnt);
  }, [tasks, sessions, sessionMinutes]);

  console.log(sessionDate);
  console.log(sessionCounts);

  return (
    <div>
      <h3>Statistics of the user</h3>
      {/* <h6>Tasks completed on date</h6> */}
      {Object.keys(taskCounts).length > 0 ? (
        <div className="taskchart">
          <h6>Tasks completed on date</h6>
          <Bar
            
            data={{
              labels: Object.keys(taskCounts),
              datasets: [
                {
                  label: "Tasks",
                  data: Object.values(taskCounts),
                  backgroundColor: ["#c64d4d"],
                  barThickness: 40,
                },
              ],
            }}
            // height={150}
            // width={300}
            // options={{ maintainAspectRatio: false }}
          />
        </div>
      ) : (
        <p>Complete Tasks to see your graph</p>
      )}
      
      {Object.keys(sessionCounts).length > 0 ? (
        <div className="sessionchart">
          <h6>Deep Work Sessions completed on date</h6>
          <Bar
            data={{
              labels: Object.keys(sessionCounts),
              datasets: [
                {
                  label: "Deep Work Sessions",
                  data: Object.values(sessionCounts),
                  backgroundColor: ["#2de282"],
                  barThickness: 40,
                },
              ],
            }}
          />
        </div>  
      ) : (
        <p>Complete Sessions to see your graph</p>
      )}
      {/* <h6>Total Deep Work minutes = {sessionMinutes}</h6> */}
    </div>
  );
};

export default Stats;
