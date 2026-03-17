import React from 'react';
import { Card, CardBody, CardHeader, Button } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

const Reports: React.FC = () => {
  const performanceData = [
    { subject: 'Math', score: 85 },
    { subject: 'Science', score: 72 },
    { subject: 'History', score: 90 },
    { subject: 'English', score: 78 },
    { subject: 'CS', score: 95 },
  ];

  const trendData = [
    { month: 'Jan', avg: 65 },
    { month: 'Feb', avg: 70 },
    { month: 'Mar', avg: 68 },
    { month: 'Apr', avg: 75 },
    { month: 'May', avg: 82 },
    { month: 'Jun', avg: 88 },
  ];

  const distributionData = [
    { name: 'Passed', value: 350 },
    { name: 'Failed', value: 40 },
  ];
  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[400px]">
          <CardHeader title="Subject Performance" subtitle="Average score per subject" />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="subject" type="category" width={80} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="min-h-[400px]">
          <CardHeader title="Learning Trend" subtitle="Average score progression over time" />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Pass/Fail Ratio" />
          <CardBody className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <div className="text-2xl font-bold text-gray-900">89%</div>
              <div className="text-xs text-gray-500">Pass Rate</div>
            </div>
          </CardBody>
        </Card>

        <Card className="col-span-1 md:col-span-2">
           <CardHeader title="Key Insights" />
           <CardBody>
             <div className="space-y-4">
               <div className="flex items-start gap-4">
                 <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0" />
                 <div>
                   <h4 className="font-medium text-gray-900">Computer Science is the strongest subject</h4>
                   <p className="text-sm text-gray-500">Students average 95% in recent quizzes, showing excellent retention of concepts.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 shrink-0" />
                 <div>
                   <h4 className="font-medium text-gray-900">Science performance has dipped</h4>
                   <p className="text-sm text-gray-500">A 5% decrease in average scores observed in the last month. Recommend reviewing biology modules.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                 <div>
                   <h4 className="font-medium text-gray-900">Engagement is highest on Thursdays</h4>
                   <p className="text-sm text-gray-500">Students are 40% more likely to complete optional quizzes mid-week.</p>
                 </div>
               </div>
             </div>
           </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
