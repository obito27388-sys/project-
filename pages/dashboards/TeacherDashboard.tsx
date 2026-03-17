import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from '../../components/ui';
import { CreateQuizForm } from '../../components/CreateQuizForm';
import { getQuizzes, addQuiz, updateQuiz, deleteQuiz } from '../../services/mockData';
import { Plus, Users, BookOpen, Clock, Edit, Trash, ChevronLeft } from 'lucide-react';
import { Quiz } from '../../types';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>(getQuizzes());
  const [isCreating, setIsCreating] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  
  const handleSaveQuiz = (quizData: Partial<Quiz>) => {
    if (editingQuiz) {
        const updatedQuiz: Quiz = {
            ...editingQuiz,
            title: quizData.title || editingQuiz.title,
            subject: quizData.subject || editingQuiz.subject,
            description: quizData.description || editingQuiz.description,
            difficulty: (quizData.difficulty as 'Easy' | 'Medium' | 'Hard') || editingQuiz.difficulty,
            durationMinutes: quizData.durationMinutes || editingQuiz.durationMinutes,
            status: (quizData.status as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED') || editingQuiz.status,
            questions: quizData.questions || editingQuiz.questions || [],
            questionsCount: quizData.questions ? quizData.questions.length : editingQuiz.questionsCount,
            randomizeQuestions: quizData.randomizeQuestions ?? editingQuiz.randomizeQuestions,
            randomizeOptions: quizData.randomizeOptions ?? editingQuiz.randomizeOptions
        };
        updateQuiz(updatedQuiz);
    } else {
        const newQuiz: Quiz = {
            id: Math.random().toString(36).substr(2, 9),
            title: quizData.title || 'Untitled Quiz',
            subject: quizData.subject || 'General',
            description: quizData.description || '',
            questionsCount: quizData.questions ? quizData.questions.length : 0,
            durationMinutes: quizData.durationMinutes || 15,
            createdBy: user?.name || 'Teacher',
            createdAt: new Date().toISOString().split('T')[0],
            status: (quizData.status as 'PUBLISHED' | 'DRAFT') || 'DRAFT',
            difficulty: (quizData.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
            questions: quizData.questions || [],
            randomizeQuestions: quizData.randomizeQuestions || false,
            randomizeOptions: quizData.randomizeOptions || false
        };
        addQuiz(newQuiz);
    }
    
    setQuizzes(getQuizzes());
    setIsCreating(false);
    setEditingQuiz(null);
  };

  const handleEditClick = (quiz: Quiz) => {
      setEditingQuiz(quiz);
      setIsCreating(true);
  };

  const handleDeleteClick = (id: string) => {
      if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
          deleteQuiz(id);
          setQuizzes(getQuizzes());
      }
  };

  const handleCancel = () => {
      setIsCreating(false);
      setEditingQuiz(null);
  }

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1 pl-1">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </div>
        <CreateQuizForm 
            onSave={handleSaveQuiz} 
            onCancel={handleCancel} 
            initialData={editingQuiz || undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your quizzes and track student performance.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create New Quiz
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Quizzes</p>
              <h3 className="text-2xl font-bold text-gray-900">{quizzes.length}</h3>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
             <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-900">142</h3>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
             <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Completion Time</p>
              <h3 className="text-2xl font-bold text-gray-900">18m</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quiz Management */}
      <div className="mt-8">
        <Card>
          <CardHeader title="Your Quizzes" />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                      <div className="text-xs text-gray-500">{quiz.questionsCount} questions • {quiz.difficulty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={quiz.status === 'PUBLISHED' ? 'green' : quiz.status === 'DRAFT' ? 'yellow' : 'gray'}>
                        {quiz.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleEditClick(quiz)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Quiz"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(quiz.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Quiz"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {quizzes.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                            No quizzes found. Click "Create New Quiz" to get started.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
