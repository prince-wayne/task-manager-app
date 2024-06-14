# Task Manager App Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Installation and Setup](#installation-and-setup)
4. [Backend](#backend)
    - [Overview](#overview)
    - [Dependencies](#dependencies)
    - [Server Configuration](#server-configuration)
    - [API Endpoints](#api-endpoints)
5. [Frontend](#frontend)
    - [Overview](#overview-1)
    - [Dependencies](#dependencies-1)
    - [Component Structure](#component-structure)
    - [Usage](#usage)
6. [Running the Application](#running-the-application)
7. [Future Enhancements](#future-enhancements)

## Introduction

This is a basic task manager application that allows users to manage tasks through a web interface. It comprises a backend server built with Node.js, Express, and MongoDB, and a frontend client built with React.

## Project Structure

```
task-manager-app/
│
├── server/              # Backend code
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── server.js        # Main server file
│   └── .env             # Environment variables
│
└── client/              # Frontend code
    ├── public/          # Public assets
    ├── src/             # Source files
    │   ├── components/  # React components
    │   ├── App.js       # Main app component
    │   └── index.js     # Entry point
    └── package.json     # Frontend dependencies
```

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd task-manager-app/server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following contents:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd task-manager-app/client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

## Backend

### Overview

The backend of the application is built using Node.js and Express, and it connects to a MongoDB database using Mongoose.

### Dependencies

- Express
- Mongoose
- dotenv
- nodemon (for development)

### Server Configuration

The main server file is `server.js`:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### API Endpoints

#### `GET /api/tasks`
- Retrieves all tasks

#### `POST /api/tasks`
- Creates a new task

#### `PUT /api/tasks/:id`
- Updates a task by ID

#### `DELETE /api/tasks/:id`
- Deletes a task by ID

Example route file (`routes/tasks.js`):

```javascript
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create a task
router.post('/', async (req, res) => {
  const newTask = new Task(req.body);
  const savedTask = await newTask.save();
  res.json(savedTask);
});

// Update a task
router.put('/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// Delete a task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
```

## Frontend

### Overview

The frontend is built using React. It includes components for displaying and managing tasks.

### Dependencies

- React
- Axios (for making API requests)
- React Router (for routing, if applicable)

### Component Structure

- `App.js`: Main app component
- `TaskList.js`: Component for displaying a list of tasks
- `TaskForm.js`: Component for adding or updating a task

### Usage

Example `App.js`:

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('/api/tasks');
    setTasks(response.data);
  };

  const addTask = async (task) => {
    const response = await axios.post('/api/tasks', task);
    setTasks([...tasks, response.data]);
  };

  const updateTask = async (task) => {
    const response = await axios.put(`/api/tasks/${task._id}`, task);
    setTasks(tasks.map(t => t._id === task._id ? response.data : t));
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div>
      <TaskForm addTask={addTask} updateTask={updateTask} currentTask={currentTask} setCurrentTask={setCurrentTask} />
      <TaskList tasks={tasks} deleteTask={deleteTask} setCurrentTask={setCurrentTask} />
    </div>
  );
}

export default App;
```

## Running the Application

### Starting the Backend Server

1. Navigate to the server directory:
   ```bash
   cd task-manager-app/server
   ```

2. Start the server:
   ```bash
   node server.js
   ```

### Starting the Frontend Development Server

1. Navigate to the client directory:
   ```bash
   cd task-manager-app/client
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## Future Enhancements

- **User Authentication**: Add user authentication and authorization.
- **Task Categories**: Allow tasks to be categorized.
- **Due Dates**: Add due dates to tasks and implement reminders.
- **Responsive Design**: Improve the design to be more responsive on different devices.
- **Unit Tests**: Add unit tests for both backend and frontend components.
