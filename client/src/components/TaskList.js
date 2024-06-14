import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      {tasks.map(task => (
        <Task key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
