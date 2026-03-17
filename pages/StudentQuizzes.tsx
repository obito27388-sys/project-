import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, Button, Badge } from '../components/ui';
import { getAttemptsForStudent, getQuizzes } from '../services/mockData';
import { Clock, CheckCircle, XCircle, Play, Eye, Search, Filter } from 'lucide-react';
import { Attempt } from '../types';

const StudentQuizzes: React.FC = () => {
    const { user } = useAuth();
    const [viewingAttempt, setViewingAttempt] = useState<Attempt | null>(null);
    const attempts = user ? getAttemptsForStudent(user.id) : [];
    const quizzes = getQuizzes();

    // Reusing the Result View Logic
    const ResultModal = ({ attempt, onClose }: { attempt: Attempt, onClose: () => void }) => {
        const quiz = quizzes.find(q => q.id === attempt.quizId);
        const questions = quiz?.questions || [];

        return (
             <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <div>
                          <h2 className="text-xl font-bold text-gray-900">Quiz Results: {attempt.quizTitle}</h2>
                          <p className="text-sm text-gray-500 mt-1">
                              Completed on {attempt.date}
                          </p>
                      </div>
                      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                          <XCircle className="w-8 h-8" />
                      </button>
                  </div>

                  <div className="overflow-y-auto p-6 space-y-8">
                      {/* Score Summary */}
                      <div className="text-center p-6 bg-indigo-50 rounded-xl mb-8">
                          <div className="text-sm text-indigo-600 font-bold uppercase tracking-wide">Your Score</div>
                          <div className="text-5xl font-bold text-indigo-900 mt-2">
                              {Math.round((attempt.score / attempt.maxScore) * 100)}%
                          </div>
                          <div className="text-gray-600 mt-2">
                              {attempt.score} out of {attempt.maxScore} correct
                          </div>
                      </div>

                      {/* Question Review */}
                      <div className="space-y-8">
                          {questions.map((q, idx) => {
                              const userAnswer = attempt.answers?.[q.id];
                              const isCorrect = userAnswer === q.correctAnswer;

                              return (
                                  <div key={q.id} className={`border rounded-lg p-6 ${isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                                      <div className="flex gap-3 mb-4">
                                          <span className="font-bold text-gray-500">Q{idx + 1}.</span>
                                          <h4 className="font-medium text-gray-900">{q.text}</h4>
                                      </div>

                                      <div className="space-y-2 ml-8 mb-4">
                                          {q.options.map((opt, optIdx) => {
                                              let optClass = "p-3 rounded-lg border text-sm flex justify-between items-center ";
                                              if (optIdx === q.correctAnswer) {
                                                  optClass += "bg-green-100 border-green-300 text-green-800 font-medium";
                                              } else if (optIdx === userAnswer && !isCorrect) {
                                                  optClass += "bg-red-100 border-red-300 text-red-800";
                                              } else {
                                                  optClass += "bg-white border-gray-200 text-gray-600 opacity-70";
                                              }

                                              return (
                                                  <div key={optIdx} className={optClass}>
                                                      {opt}
                                                      {optIdx === q.correctAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
                                                      {optIdx === userAnswer && !isCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                                                  </div>
                                              );
                                          })}
                                      </div>

                                      {/* Explanation Section */}
                                      {q.explanation && (
                                        <div className="ml-8 mt-4 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-1">
                                                <div className="bg-indigo-100 p-1 rounded-full"><Play className="w-3 h-3 fill-indigo-600" /></div>
                                                Explanation:
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {q.explanation}
                                            </p>
                                        </div>
                                      )}
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                      <Button onClick={onClose}>Close Results</Button>
                  </div>
              </div>
          </div>
        );
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
                    <p className="text-gray-600 mt-1">History of your attempts and results.</p>
                </div>
            </div>

            <Card>
                <CardBody>
                    <div className="flex items-center gap-4 mb-6">
                         <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text"
                                placeholder="Search past quizzes..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <Button variant="secondary" className="gap-2">
                            <Filter className="w-4 h-4" /> Filter
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Taken</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attempts.map(attempt => (
                            <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attempt.quizTitle}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attempt.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{attempt.score}/{attempt.maxScore}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${attempt.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {attempt.passed ? 'Passed' : 'Failed'}
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Button size="sm" variant="outline" onClick={() => setViewingAttempt(attempt)} className="gap-2">
                                        <Eye className="w-4 h-4" /> View Report
                                    </Button>
                                </td>
                            </tr>
                            ))}
                            {attempts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No quizzes taken yet. Go to the dashboard to start a new quiz!
                                </td>
                            </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {viewingAttempt && <ResultModal attempt={viewingAttempt} onClose={() => setViewingAttempt(null)} />}
        </div>
    );
};

export default StudentQuizzes;