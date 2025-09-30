import { useMemo } from 'react';

interface Task {
  _id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface Habit {
  _id: string;
  name: string;
  streak: number;
}

interface KeyStatsProps {
  tasks: Task[];
  habits: Habit[];
}

export default function KeyStats({ tasks, habits }: KeyStatsProps) {
  const stats = useMemo(() => {
    const activeTasks = tasks.filter(task => task.status === 'in-progress').length;
    const longestStreak = Math.max(0, ...habits.map(habit => habit.streak));
    const totalTasksDone = tasks.filter(task => task.status === 'done').length;
    return { activeTasks, longestStreak, totalTasksDone };
  }, [tasks, habits]);

  const statCard = (label: string, value: number | string) => (
    <div className="bg-black/20 p-3 rounded-lg text-center">
      <p className="text-2xl font-bold text-[var(--accent-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
    </div>
  );

  return (
    <div className="bg-[var(--card-background)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--border-color)] p-4">
      <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">Key Stats</h3>
      <div className="grid grid-cols-1 gap-2">
        {statCard('Active Tasks', stats.activeTasks)}
        {statCard('Longest Streak', `${stats.longestStreak} 🔥`)}
        {statCard('Total Tasks Done', stats.totalTasksDone)}
      </div>
    </div>
  );
}
