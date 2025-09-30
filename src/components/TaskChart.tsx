
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Task {
  _id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface TaskChartProps {
  tasks: Task[];
}

export default function TaskChart({ tasks }: TaskChartProps) {
  const data = [
    {
      name: 'Tasks',
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis dataKey="name" stroke="#E2E8F0" />
        <YAxis stroke="#E2E8F0" />
        <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
        <Legend wrapperStyle={{ color: '#E2E8F0' }} />
        <Bar dataKey="todo" fill="#F56565" name="To Do" />
        <Bar dataKey="inProgress" fill="#ECC94B" name="In Progress" />
        <Bar dataKey="done" fill="#48BB78" name="Done" />
      </BarChart>
    </ResponsiveContainer>
  );
}
