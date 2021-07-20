import { useState } from "react";
import "../styles/css/tasks.css";

const TaskForm = ({ handleAddTask }) => {
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    handleAddTask(e, input);
    setInput("");
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <label>Task name:</label>
      <input
        type="text"
        required
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="dashbttn" type="submit"><b>Add the task</b></button>
    </form>
  );
};

export default TaskForm;
