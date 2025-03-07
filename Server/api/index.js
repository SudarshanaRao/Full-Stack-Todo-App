const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Dharsh@2003',
    database: process.env.DB_NAME || 'sys',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (!err) {
        console.log("Connected to database successfully");
    } else {
        console.error("Database connection failed:", err);
    }
});

const fetchTasks = (res) => {
    const query = 'SELECT * FROM todos';
    db.query(query, (err, tasks) => {
        if (err) {
            console.error('Error retrieving tasks:', err);
            res.status(500).send('Error retrieving task list');
        } else {
            res.json(tasks);
        }
    });
};

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
            fetchTasks(res);
        }
    });
});

app.get('/read-tasks', (req, res) => {
    fetchTasks(res);
});

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
            fetchTasks(res);
        }
    });
});

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
            fetchTasks(res);
        }
    });
});

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
            fetchTasks(res);
        }
    });
});

// Export Express app for Vercel
module.exports = app;
