import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaTasks, 
  FaPlus, 
  FaTrash, 
  FaClock, 
  FaArrowLeft, 
  FaArrowRight, 
  FaCheck,
  FaExclamationCircle
} from 'react-icons/fa';

import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Task creation Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const { title, description, status, priority, dueDate } = taskData;

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onInputChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post('/api/tasks', taskData);
      if (res.data.success) {
        toast.success('Task created successfully!');
        setIsModalOpen(false);
        setTaskData({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: ''
        });
        fetchTasks();
      }
    } catch (err) {
      toast.error('Failed to create production task');
    } finally {
      setSubmitting(false);
    }
  };

  // Move task status handler
  const moveTask = async (task, newStatus) => {
    try {
      const res = await axios.put(`/api/tasks/${task._id}`, {
        title: task.title,
        dueDate: task.dueDate,
        status: newStatus,
        priority: task.priority,
        description: task.description
      });
      if (res.data.success) {
        setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
        toast.success(`Task shifted to ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (id) => {
    const confirm = window.confirm('Are you sure you want to permanently delete this task?');
    if (confirm) {
      try {
        const res = await axios.delete(`/api/tasks/${id}`);
        if (res.data.success) {
          toast.success('Task deleted successfully.');
          fetchTasks();
        }
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  // Filter tasks into columns
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Render a task card helper
  const renderTaskCard = (task) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
    
    return (
      <div key={task._id} className="task-card glass-card">
        <div className="flex-between">
          <span className="badge" style={{
            backgroundColor: 
              task.priority === 'high' ? 'rgba(239, 68, 68, 0.15)' :
              task.priority === 'medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: 
              task.priority === 'high' ? 'var(--danger)' :
              task.priority === 'medium' ? 'var(--warning)' : 'var(--success)',
            padding: '0.15rem 0.5rem',
            fontSize: '0.65rem'
          }}>
            {task.priority.toUpperCase()}
          </span>

          <button className="delete-task-btn" onClick={() => handleDeleteTask(task._id)} title="Delete Task">
            <FaTrash />
          </button>
        </div>

        <h4 className="task-card-title">{task.title}</h4>
        
        {task.description && (
          <p className="task-card-desc">{task.description}</p>
        )}

        <div className="flex-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <span className="flex-align" style={{ 
            fontSize: '0.7rem', 
            color: isOverdue ? 'var(--danger)' : 'var(--text-secondary)',
            fontWeight: isOverdue ? 700 : 500
          }}>
            <FaClock /> {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && <FaExclamationCircle style={{ marginLeft: '2px' }} title="Overdue!" />}
          </span>

          {/* Action moves */}
          <div className="flex-align" style={{ gap: '0.25rem' }}>
            {task.status !== 'todo' && (
              <button 
                className="task-action-btn" 
                onClick={() => moveTask(task, task.status === 'completed' ? 'in-progress' : 'todo')}
                title="Move Left"
              >
                <FaArrowLeft />
              </button>
            )}
            
            {task.status !== 'completed' && (
              <button 
                className="task-action-btn" 
                onClick={() => moveTask(task, task.status === 'todo' ? 'in-progress' : 'completed')}
                title="Move Right"
              >
                <FaArrowRight />
              </button>
            )}
            
            {task.status === 'completed' && (
              <span className="task-check-indicator"><FaCheck /></span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content" style={{ paddingBottom: '3rem' }}>
        {/* Title bar */}
        <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Production <span className="gradient-text">Kanban</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Organize video topics through production states: script, record, edit, and scheduled release.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Add Task
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="kanban-board">
          {/* Column: To Do */}
          <div className="kanban-column">
            <div className="column-header todo flex-between">
              <span className="flex-align"><FaTasks /> TO DO</span>
              <span className="column-count">{todoTasks.length}</span>
            </div>
            <div className="column-body">
              {todoTasks.length > 0 ? todoTasks.map(renderTaskCard) : (
                <div className="column-empty">No tasks in backlog</div>
              )}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="kanban-column">
            <div className="column-header in-progress flex-between">
              <span className="flex-align"><FaTasks /> IN PROGRESS</span>
              <span className="column-count">{inProgressTasks.length}</span>
            </div>
            <div className="column-body">
              {inProgressTasks.length > 0 ? inProgressTasks.map(renderTaskCard) : (
                <div className="column-empty">No tasks active</div>
              )}
            </div>
          </div>

          {/* Column: Completed */}
          <div className="kanban-column">
            <div className="column-header completed flex-between">
              <span className="flex-align"><FaTasks /> COMPLETED</span>
              <span className="column-count">{completedTasks.length}</span>
            </div>
            <div className="column-body">
              {completedTasks.length > 0 ? completedTasks.map(renderTaskCard) : (
                <div className="column-empty">No tasks completed</div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Create Task details */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Production Task">
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onInputChange}
                className="form-input"
                required
                placeholder="e.g. Record Intro Section for MERN App"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                name="description"
                value={description}
                onChange={onInputChange}
                className="form-input"
                placeholder="Details of scripts, references, resources..."
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  value={priority}
                  onChange={onInputChange}
                  className="form-select"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Production Status</label>
                <select
                  name="status"
                  value={status}
                  onChange={onInputChange}
                  className="form-select"
                >
                  <option value="todo">To Do (Scripting)</option>
                  <option value="in-progress">In Progress (Recording/Editing)</option>
                  <option value="completed">Completed (Rendered/Uploaded)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date Deadline</label>
              <input
                type="date"
                name="dueDate"
                value={dueDate}
                onChange={onInputChange}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', height: '42px', marginTop: '1rem' }}>
              {submitting ? 'Creating task...' : 'Create Task'}
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default Tasks;
