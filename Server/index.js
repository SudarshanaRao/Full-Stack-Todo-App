const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "Dharsh@2003",
    database: 'sys'
});

db.connect((err) => {
    if (!err) {
        console.log("Connected to database successfully");
    } else {
        console.error("Database connection failed:", err);
    }
});

// Function to retrieve the full list of tasks
const fetchTasks = (res) => {
    const query = 'SELECT * FROM todos';
    db.query(query, (err, tasks) => {
        if (err) {
            console.error('Error retrieving tasks:', err);
            res.status(500).send('Error retrieving task list');
        } else {
            res.send(tasks);
        }
    });
};

// Add Task Endpoint
app.post('/new-task', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).send('Task content is required');
    }

    const query = 'INSERT INTO todos (task, createdAt, status) VALUES (?, NOW(), ?)';
    db.query(query, [task, 'active'], (err) => {
        if (err) {
            console.error('Failed to store new task:', err);
            res.status(500).send('Error storing task');
        } else {
            console.log('Task saved successfully');
            fetchTasks(res); // Fetch updated task list
        }
    });
});

// Read All Tasks Endpoint
app.get('/read-tasks', (req, res) => {
    fetchTasks(res);
});

// Update Task Endpoint
app.post('/update-task', (req, res) => {
    const { updateId, task } = req.body;
    if (!task || !updateId) {
        return res.status(400).send('Task content and ID are required');
    }

    const query = 'UPDATE todos SET task = ? WHERE id = ?';
    db.query(query, [task, updateId], (err) => {
        if (err) {
            console.error('Failed to update task:', err);
            res.status(500).send('Error updating task');
        } else {
            console.log('Task updated successfully');
            fetchTasks(res); // Fetch updated task list
        }
    });
});

// Delete Task Endpoint
app.post('/delete-task', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send('Task ID is required');
    }

    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Failed to delete task:', err);
            res.status(500).send('Error deleting task');
        } else {
            console.log('Task deleted successfully');
            fetchTasks(res); // Fetch updated task list
        }
    });
});

// Mark Task as Complete Endpoint
app.post('/complete-task', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send('Task ID is required');
    }

    const query = 'UPDATE todos SET status = ? WHERE id = ?';
    db.query(query, ['completed', id], (err) => {
        if (err) {
            console.error('Failed to mark task as completed:', err);
            res.status(500).send('Error marking task as completed');
        } else {
            console.log('Task marked as completed');
            fetchTasks(res); // Fetch updated task list
        }
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server started on port 5000');
});
