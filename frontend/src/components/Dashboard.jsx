import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await api.post('/tasks', { title: newTaskTitle, description: newTaskDesc });
      setNewTaskTitle('');
      setNewTaskDesc('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-brand">✓ TaskFlow</div>
        <div className="nav-profile">
          <span className="welcome-text">Hi, {user?.username}</span>
          <button className="outline-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="task-creation-card">
          <h3>Create New Task</h3>
          <form className="task-form" onSubmit={handleCreateTask}>
            <input 
              type="text" 
              placeholder="Task Title" 
              value={newTaskTitle} 
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required 
              className="task-input"
            />
            <input 
              type="text" 
              placeholder="Task Description (optional)" 
              value={newTaskDesc} 
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="task-input"
            />
            <button type="submit" className="primary-btn add-btn">+</button>
          </form>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create one above!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.status === 'COMPLETED' ? 'completed' : ''}`}>
                <div className="task-content">
                  <div className="task-header">
                    <input 
                      type="checkbox" 
                      checked={task.status === 'COMPLETED'}
                      onChange={() => toggleTaskStatus(task)}
                      className="custom-checkbox"
                    />
                    <span className="task-title">{task.title}</span>
                  </div>
                  {task.description && <p className="task-desc">{task.description}</p>}
                </div>
                <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
