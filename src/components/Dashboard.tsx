
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskChart from './TaskChart';
import Quote from './Quote';
import ThemeSwitcher from './ThemeSwitcher';
import KeyStats from './KeyStats';
import EventList from './EventList';
import MoodTracker from './MoodTracker';

interface Task {
  _id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface Habit {
  _id: string;
  name: string;
  streak: number;
  lastCompleted: Date;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newHabitName, setNewHabitName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tasksRes, habitsRes, userRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/habits'),
          fetch('/api/user'),
        ]);

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.data);
        } else {
          setError(prev => prev + ' Failed to fetch tasks.');
        }

        if (habitsRes.ok) {
          const habitsData = await habitsRes.json();
          setHabits(habitsData.data);
        } else {
          setError(prev => prev + ' Failed to fetch habits.');
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData.data);
        } else {
          setError(prev => prev + ' Failed to fetch user data.');
        }
      } catch (error) {
        setError('An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auth Handlers
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during logout.');
    }
  };

  // Task Handlers
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, status: 'todo' }),
      });
      if (res.ok) {
        const data = await res.json();
        setTasks([data.data, ...tasks]);
        setNewTaskTitle('');
      } else { setError('Failed to add task.'); }
    } catch (error) { setError('An error occurred.'); }
  };

  const handleUpdateTaskStatus = async (id: string, status: Task['status']) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTasks(tasks.map(task => task._id === id ? { ...task, status } : task));
      } else { setError('Failed to update task.'); }
    } catch (error) { setError('An error occurred.'); }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(task => task._id !== id));
      } else { setError('Failed to delete task.'); }
    } catch (error) { setError('An error occurred.'); }
  };

  // Habit Handlers
  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName) return;
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newHabitName }),
      });
      if (res.ok) {
        const data = await res.json();
        setHabits([data.data, ...habits]);
        setNewHabitName('');
      } else { setError('Failed to add habit.'); }
    } catch (error) { setError('An error occurred.'); }
  };

  const handleCompleteHabit = async (id: string) => {
    try {
      const res = await fetch(`/api/habits/${id}`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setHabits(habits.map(h => h._id === id ? data.data : h));
      } else { setError('Failed to complete habit.'); }
    } catch (error) { setError('An error occurred.'); }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      const res = await fetch(`/api/habits/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHabits(habits.filter(h => h._id !== id));
      } else { setError('Failed to delete habit.'); }
    } catch (error) { setError('An error occurred.'); }
  };

  const isHabitCompletedToday = (lastCompleted: Date) => {
      if (!lastCompleted) return false;
      const today = new Date();
      const completedDate = new Date(lastCompleted);
      return today.toDateString() === completedDate.toDateString();
  }

  const cardClasses = "bg-[var(--card-background)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--border-color)] p-6";
  const inputClasses = "w-full px-4 py-2 text-[var(--text-primary)] bg-black/20 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition";
  const buttonClasses = (accent: 'primary' | 'secondary') => `w-full px-4 py-3 font-semibold text-white bg-[var(--accent-${accent})] rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--accent-${accent})] transition-transform duration-200 hover:scale-105`;

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <div className="flex items-center gap-4">
            {currentUser && <span className="text-xl font-medium text-[var(--text-secondary)]">Welcome, {currentUser.username}!</span>}
            <button onClick={handleLogout} className="px-4 py-2 font-semibold bg-red-600/80 backdrop-blur-lg border border-white/10 rounded-lg hover:bg-red-700/80 transition-all duration-200">Logout</button>
          </div>
        </div>
        
        {error && <p className="bg-red-500/30 text-red-200 p-3 rounded-lg mb-6 border border-red-400/50">{error}</p>}

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-2xl text-[var(--text-secondary)]">Loading your dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className={cardClasses}>
                <h2 className="text-2xl font-semibold mb-4">Add New</h2>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Enter a new task..." className={inputClasses} />
                  <button type="submit" className={buttonClasses('primary')}>Add Task</button>
                </form>
                <form onSubmit={handleAddHabit} className="space-y-4 mt-4">
                  <input type="text" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} placeholder="Enter a new habit..." className={inputClasses} />
                  <button type="submit" className={buttonClasses('secondary')}>Add Habit</button>
                </form>
              </div>
              <Quote />
              <ThemeSwitcher />
              <KeyStats tasks={tasks} habits={habits} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className={cardClasses}>
                <h2 className="text-2xl font-semibold mb-4">Productivity Stats</h2>
                <TaskChart tasks={tasks} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`${cardClasses} space-y-4`}>
                  <h2 className="text-2xl font-semibold">Your Tasks</h2>
                  {tasks.map(task => (
                    <div key={task._id} className="bg-black/20 p-4 rounded-lg flex items-center justify-between transition-all duration-200 hover:bg-black/40">
                      <span className={`flex-grow ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>{task.title}</span>
                      <div className="flex items-center gap-2">
                        <select value={task.status} onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value as Task['status'])} className="bg-black/30 border border-[var(--border-color)] rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]">
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                        <button onClick={() => handleDeleteTask(task._id)} className="px-3 py-1 text-sm font-semibold text-white bg-red-600/80 rounded-md hover:bg-red-700/80">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`${cardClasses} space-y-4`}>
                  <h2 className="text-2xl font-semibold">Your Habits</h2>
                  {habits.map(habit => (
                    <div key={habit._id} className="bg-black/20 p-4 rounded-lg flex items-center justify-between transition-all duration-200 hover:bg-black/40">
                      <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleCompleteHabit(habit._id)} 
                            disabled={isHabitCompletedToday(habit.lastCompleted)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${isHabitCompletedToday(habit.lastCompleted) ? 'bg-green-500/80 text-white cursor-not-allowed' : 'bg-black/30 hover:bg-green-600/80'}`}>
                            ✓
                        </button>
                        <div>
                            <span className="font-semibold">{habit.name}</span>
                            <p className="text-sm text-[var(--text-secondary)]">Streak: {habit.streak} 🔥</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteHabit(habit._id)} className="px-3 py-1 text-sm font-semibold text-white bg-red-600/80 rounded-md hover:bg-red-700/80">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <MoodTracker />
                </div>
                <div className="lg:w-2/3">
                  <EventList />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
