import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Button } from '../../components/ui';
import { getUsers, getQuizzes, getAttempts } from '../../services/mockData';
import { User, Activity, Shield, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const users = getUsers();
  const quizzes = getQuizzes();
  const attempts = getAttempts();

  const chartData = [
    { name: 'Mon', attempts: 4 },
    { name: 'Tue', attempts: 7 },
    { name: 'Wed', attempts: 15 },
    { name: 'Thu', attempts: 10 },
    { name: 'Fri', attempts: 23 },
    { name: 'Sat', attempts: 18 },
    { name: 'Sun', attempts: 12 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-l-4 border-indigo-600">
          <CardBody>
             <div className="text-sm font-medium text-gray-500">Total Users</div>
             <div className="text-3xl font-bold text-gray-900 mt-2">{users.length}</div>
          </CardBody>
        </Card>
        <Card className="bg-white border-l-4 border-green-600">
          <CardBody>
             <div className="text-sm font-medium text-gray-500">Active Quizzes</div>
             <div className="text-3xl font-bold text-gray-900 mt-2">{quizzes.filter(q => q.status === 'PUBLISHED').length}</div>
          </CardBody>
        </Card>
        <Card className="bg-white border-l-4 border-purple-600">
          <CardBody>
             <div className="text-sm font-medium text-gray-500">Total Attempts</div>
             <div className="text-3xl font-bold text-gray-900 mt-2">{attempts.length}</div>
          </CardBody>
        </Card>
        <Card className="bg-white border-l-4 border-red-600">
           <CardBody>
             <div className="text-sm font-medium text-gray-500">System Alerts</div>
             <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[400px]">
          <CardHeader title="Weekly Activity" />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attempts" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Users" action={<Button size="sm" variant="outline">View All</Button>} />
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                           {u.avatar ? <img src={u.avatar} className="h-8 w-8 rounded-full" /> : <User className="h-4 w-4 text-gray-500" />}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <Badge color={u.role === 'ADMIN' ? 'red' : u.role === 'TEACHER' ? 'blue' : 'green'}>{u.role}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
