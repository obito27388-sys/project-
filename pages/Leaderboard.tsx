import React from 'react';
import { Card, CardBody, CardHeader, Badge } from '../components/ui';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard: React.FC = () => {
  // Mock Leaderboard Data
  const leaders = [
    { rank: 1, name: 'Hermione Granger', points: 1250, quizzes: 15, avatar: 'https://picsum.photos/203' },
    { rank: 2, name: 'Lisa Simpson', points: 1180, quizzes: 14, avatar: 'https://picsum.photos/204' },
    { rank: 3, name: 'Velma Dinkley', points: 1050, quizzes: 12, avatar: 'https://picsum.photos/205' },
    { rank: 4, name: 'Dexter', points: 980, quizzes: 10, avatar: 'https://picsum.photos/206' },
    { rank: 5, name: 'Jimmy Neutron', points: 950, quizzes: 10, avatar: 'https://picsum.photos/207' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Global Leaderboard</h1>
        <p className="text-gray-500 mt-2">See who's topping the charts this month!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
        {/* 2nd Place */}
        <Card className="order-2 md:order-1 transform md:translate-y-4 border-t-4 border-gray-400">
          <CardBody className="flex flex-col items-center text-center p-6">
            <div className="relative mb-3">
              <img src={leaders[1].avatar} className="w-20 h-20 rounded-full border-4 border-gray-200" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-white rounded-full p-1 shadow-md">
                <Medal className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold mt-2">{leaders[1].name}</h3>
            <p className="text-indigo-600 font-bold">{leaders[1].points} pts</p>
          </CardBody>
        </Card>

        {/* 1st Place */}
        <Card className="order-1 md:order-2 transform md:-translate-y-4 border-t-4 border-yellow-400 shadow-lg scale-105 z-10">
          <CardBody className="flex flex-col items-center text-center p-8">
             <div className="relative mb-3">
              <img src={leaders[0].avatar} className="w-24 h-24 rounded-full border-4 border-yellow-200" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-white rounded-full p-1.5 shadow-md">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mt-2">{leaders[0].name}</h3>
            <p className="text-indigo-600 font-bold text-lg">{leaders[0].points} pts</p>
          </CardBody>
        </Card>

        {/* 3rd Place */}
        <Card className="order-3 border-t-4 border-amber-600 transform md:translate-y-4">
          <CardBody className="flex flex-col items-center text-center p-6">
            <div className="relative mb-3">
              <img src={leaders[2].avatar} className="w-20 h-20 rounded-full border-4 border-amber-200" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white rounded-full p-1 shadow-md">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold mt-2">{leaders[2].name}</h3>
            <p className="text-indigo-600 font-bold">{leaders[2].points} pts</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quizzes Taken</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Points</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaders.map((leader, index) => (
                <tr key={index} className={index < 3 ? 'bg-indigo-50/30' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                      ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                        index === 1 ? 'bg-gray-100 text-gray-800' : 
                        index === 2 ? 'bg-amber-100 text-amber-800' : 'text-gray-500'}
                    `}>
                      {leader.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full mr-3" src={leader.avatar} alt="" />
                      <div className="text-sm font-medium text-gray-900">{leader.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leader.quizzes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-indigo-600">{leader.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
