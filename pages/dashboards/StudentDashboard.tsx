import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, Button, Badge } from '../../components/ui';
import { getQuizzes, getAttemptsForStudent, saveAttempt } from '../../services/mockData';
import { Clock, CheckCircle, Play, XCircle, ArrowRight, RefreshCw, Trophy, Zap } from 'lucide-react';
import { Quiz, Attempt } from '../../types';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  // We use key to force re-render when attempts change
  const [refreshKey, setRefreshKey] = useState(0); 
  const quizzes = getQuizzes();
  const attempts = user ? getAttemptsForStudent(user.id) : [];

  const availableQuizzes = quizzes.filter(q => q.status === 'PUBLISHED');

  // State for Taking Quiz
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  
  // State for Viewing Results
  const [viewingAttempt, setViewingAttempt] = useState<Attempt | null>(null);

  interface SavedProgress {
    quizId: string;
    currentQuestionIndex: number;
    userAnswers: Record<string, number>;
    timestamp: number;
    shuffledQuiz?: Quiz;
  }

  // Auto-save effect
  useEffect(() => {
    if (activeQuiz && user) {
      const progress: SavedProgress = {
        quizId: activeQuiz.id,
        currentQuestionIndex,
        userAnswers,
        timestamp: Date.now(),
        shuffledQuiz: activeQuiz,
      };
      localStorage.setItem(`quiz_progress_${user.id}_${activeQuiz.id}`, JSON.stringify(progress));
    }
  }, [activeQuiz, currentQuestionIndex, userAnswers, user]);

  // Helper to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStartQuiz = (quiz: Quiz) => {
      if (!user) return;

      const savedProgressStr = localStorage.getItem(`quiz_progress_${user.id}_${quiz.id}`);
      if (savedProgressStr) {
          try {
              const savedProgress: SavedProgress = JSON.parse(savedProgressStr);
              if (window.confirm('You have an unfinished attempt for this quiz. Do you want to resume?')) {
                  setActiveQuiz(savedProgress.shuffledQuiz || quiz);
                  setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
                  setUserAnswers(savedProgress.userAnswers);
                  return;
              } else {
                  localStorage.removeItem(`quiz_progress_${user.id}_${quiz.id}`);
              }
          } catch (e) {
              console.error("Failed to parse saved progress", e);
          }
      }

      let finalQuiz = { ...quiz };
      if (finalQuiz.questions) {
          let questions = [...finalQuiz.questions];
          
          if (finalQuiz.randomizeQuestions) {
              questions = shuffleArray(questions);
          }

          if (finalQuiz.randomizeOptions) {
              questions = questions.map(q => {
                  const optionsWithIndex = q.options.map((opt, idx) => ({ text: opt, isCorrect: idx === q.correctAnswer }));
                  const shuffledOptions = shuffleArray(optionsWithIndex);
                  const newCorrectAnswer = shuffledOptions.findIndex(o => o.isCorrect);
                  return {
                      ...q,
                      options: shuffledOptions.map(o => o.text),
                      correctAnswer: newCorrectAnswer
                  };
              });
          }
          finalQuiz.questions = questions;
      }

      setActiveQuiz(finalQuiz);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
      setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
      if (!activeQuiz || !user) return;

      const questions = activeQuiz.questions || [];
      let score = 0;
      questions.forEach(q => {
          if (userAnswers[q.id] === q.correctAnswer) {
              score++;
          }
      });

      const attempt: Attempt = {
          id: Math.random().toString(36).substr(2, 9),
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          studentId: user.id,
          score: score,
          maxScore: questions.length,
          date: new Date().toISOString().split('T')[0],
          passed: (score / questions.length) >= 0.5,
          answers: userAnswers
      };

      saveAttempt(attempt);
      localStorage.removeItem(`quiz_progress_${user.id}_${activeQuiz.id}`);
      setRefreshKey(prev => prev + 1);
      setActiveQuiz(null);
      setViewingAttempt(attempt); // Auto open results
  };

  // --- Quiz Taker View ---
  if (activeQuiz && activeQuiz.questions) {
      const question = activeQuiz.questions[currentQuestionIndex];
      const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

      return (
          <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{activeQuiz.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                             <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {activeQuiz.durationMinutes}m</span>
                             <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => {
                          if (window.confirm('Are you sure you want to exit? Your progress has been saved and you can resume later.')) {
                              setActiveQuiz(null);
                          }
                      }}>
                          Save & Exit
                      </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>

                  {/* Question Card */}
                  <Card className="flex-1 flex flex-col">
                      <CardBody className="flex-1 flex flex-col">
                          <div className="mb-6">
                              <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
                                  {question.text}
                              </h3>
                          </div>

                          <div className="space-y-3 mb-8">
                              {question.options.map((option, idx) => (
                                  <div 
                                      key={idx}
                                      onClick={() => handleAnswerSelect(question.id, idx)}
                                      className={`
                                          p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3
                                          ${userAnswers[question.id] === idx 
                                              ? 'border-indigo-600 bg-indigo-50' 
                                              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
                                      `}
                                  >
                                      <div className={`
                                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                          ${userAnswers[question.id] === idx ? 'border-indigo-600' : 'border-gray-300'}
                                      `}>
                                          {userAnswers[question.id] === idx && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                                      </div>
                                      <span className="text-gray-700">{option}</span>
                                  </div>
                              ))}
                          </div>

                          <div className="mt-auto flex justify-between">
                              <Button 
                                  variant="secondary" 
                                  disabled={currentQuestionIndex === 0}
                                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                              >
                                  Previous
                              </Button>
                              
                              {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                                  <Button 
                                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                      className="gap-2"
                                  >
                                      Next Question <ArrowRight className="w-4 h-4" />
                                  </Button>
                              ) : (
                                  <Button 
                                      onClick={handleSubmitQuiz}
                                      className="gap-2"
                                  >
                                      Submit Quiz <CheckCircle className="w-4 h-4" />
                                  </Button>
                              )}
                          </div>
                      </CardBody>
                  </Card>
              </div>
          </div>
      );
  }

  // --- Result View ---
  if (viewingAttempt) {
      const quiz = quizzes.find(q => q.id === viewingAttempt.quizId);
      const questions = quiz?.questions || [];

      return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <div>
                          <h2 className="text-xl font-bold text-gray-900">Quiz Results: {viewingAttempt.quizTitle}</h2>
                          <p className="text-sm text-gray-500 mt-1">
                              Completed on {viewingAttempt.date}
                          </p>
                      </div>
                      <button onClick={() => setViewingAttempt(null)} className="text-gray-400 hover:text-gray-600">
                          <XCircle className="w-8 h-8" />
                      </button>
                  </div>

                  <div className="overflow-y-auto p-6 space-y-8">
                      {/* Score Summary */}
                      <div className="text-center p-6 bg-indigo-50 rounded-xl mb-8">
                          <div className="text-sm text-indigo-600 font-bold uppercase tracking-wide">Your Score</div>
                          <div className="text-5xl font-bold text-indigo-900 mt-2">
                              {Math.round((viewingAttempt.score / viewingAttempt.maxScore) * 100)}%
                          </div>
                          <div className="text-gray-600 mt-2">
                              {viewingAttempt.score} out of {viewingAttempt.maxScore} correct
                          </div>
                      </div>

                      {/* Question Review */}
                      <div className="space-y-8">
                          {questions.map((q, idx) => {
                              const userAnswer = viewingAttempt.answers?.[q.id];
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
                      <Button onClick={() => setViewingAttempt(null)}>Close Results</Button>
                  </div>
              </div>
          </div>
      );
  }

  // --- Dashboard View (Default) ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Ready to learn something new today?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none relative overflow-hidden">
          <CardBody>
            <div className="relative z-10">
                <div className="text-indigo-100 font-medium mb-1">Quizzes Completed</div>
                <div className="text-4xl font-bold">{attempts.length}</div>
            </div>
            <Trophy className="absolute right-4 bottom-4 w-16 h-16 text-indigo-400 opacity-30" />
          </CardBody>
        </Card>
        <Card>
           <CardBody>
            <div className="text-gray-500 font-medium mb-1">Average Score</div>
            <div className="text-4xl font-bold text-gray-900">
              {attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + (curr.score / curr.maxScore * 100), 0) / attempts.length) : 0}%
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-gray-500 font-medium mb-1">Available Quizzes</div>
            <div className="text-4xl font-bold text-gray-900">{availableQuizzes.length}</div>
          </CardBody>
        </Card>
      </div>

      {/* Available Quizzes */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-gray-900">Quiz Library</h2>
             <Link to="/student/quizzes" className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center">
                View My History <ArrowRight className="w-4 h-4 ml-1" />
             </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuizzes.map(quiz => {
              const lastAttempt = attempts.find(a => a.quizId === quiz.id);
              return (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardBody>
                    <div className="flex justify-between items-start mb-4">
                    <Badge color={quiz.difficulty === 'Easy' ? 'green' : quiz.difficulty === 'Medium' ? 'yellow' : 'red'}>
                        {quiz.difficulty}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {quiz.durationMinutes}m
                    </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{quiz.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{quiz.questionsCount} Questions</span>
                    <span>{quiz.subject}</span>
                    </div>
                    
                    {lastAttempt ? (
                        <div className="flex gap-2">
                            <Button 
                                fullWidth 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setViewingAttempt(lastAttempt)} 
                                className="gap-2"
                            >
                                <Zap className="w-4 h-4" /> Latest Score
                            </Button>
                            <Button 
                                fullWidth 
                                size="sm" 
                                onClick={() => handleStartQuiz(quiz)} 
                                className="gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Retake
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            fullWidth 
                            size="sm" 
                            onClick={() => handleStartQuiz(quiz)} 
                            className="gap-2"
                            disabled={!quiz.questions || quiz.questions.length === 0}
                        >
                            <Play className="w-4 h-4" /> Start Quiz
                        </Button>
                    )}
                </CardBody>
                </Card>
              );
          })}
          {availableQuizzes.length === 0 && (
             <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500">No quizzes available right now. Check back later!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;