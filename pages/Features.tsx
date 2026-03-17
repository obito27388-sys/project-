import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Check, Monitor, Layout, BarChart, Lock, Users, Clock } from 'lucide-react';
import { Button } from '../components/ui';

const Features: React.FC = () => {
  const featuresList = [
    {
      icon: <Monitor className="w-6 h-6 text-blue-600" />,
      title: "Interactive UI",
      description: "A clean, modern interface designed for engagement and ease of use for both students and teachers."
    },
    {
      icon: <Layout className="w-6 h-6 text-indigo-600" />,
      title: "My Library",
      description: "Create and manage a vast library of questions with support for various types and difficulty levels."
    },
    {
      icon: <BarChart className="w-6 h-6 text-purple-600" />,
      title: "Detailed Analytics",
      description: "Gain insights into student performance with comprehensive charts, graphs, and exportable reports."
    },
    {
      icon: <Lock className="w-6 h-6 text-green-600" />,
      title: "Secure Testing",
      description: "Advanced anti-cheating measures and secure environments to ensure the integrity of assessments."
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "Role Management",
      description: "Distinct dashboards and permissions for Admins, Teachers, and Students."
    },
    {
      icon: <Clock className="w-6 h-6 text-red-600" />,
      title: "Timed Quizzes",
      description: "Set strict time limits for assessments to simulate real exam conditions."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
       <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-2xl hover:text-indigo-700 transition-colors">
            <Zap className="w-6 h-6" />
            <span>SyncQuiz</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Powerful Features for Modern Education</h1>
            <p className="text-xl text-gray-600">Discover what makes SyncQuiz the preferred choice for institutions worldwide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresList.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
       <div className="bg-indigo-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your assessments?</h2>
            <Link to="/register">
                <Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-100 border-none">
                    Get Started
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;