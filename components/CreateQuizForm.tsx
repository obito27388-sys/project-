import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, Badge } from './ui';
import { Save, X, FileText, Clock, Hash, Trash, Plus, CheckCircle, Circle, Edit, BookOpen, Search } from 'lucide-react';
import { Quiz, Question } from '../types';
import { getBankQuestions } from '../services/mockData';

interface CreateQuizFormProps {
  onSave: (quizData: Partial<Quiz>) => void;
  onCancel: () => void;
  initialData?: Quiz;
}

export const CreateQuizForm: React.FC<CreateQuizFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subject: initialData?.subject || '',
    description: initialData?.description || '',
    difficulty: (initialData?.difficulty || 'Easy') as 'Easy' | 'Medium' | 'Hard',
    durationMinutes: initialData?.durationMinutes || 15,
    status: (initialData?.status || 'DRAFT') as 'PUBLISHED' | 'DRAFT',
    randomizeQuestions: initialData?.randomizeQuestions || false,
    randomizeOptions: initialData?.randomizeOptions || false,
  });

  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryQuestions, setLibraryQuestions] = useState<Question[]>([]);
  const [selectedLibraryQuestionIds, setSelectedLibraryQuestionIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (showLibraryModal) {
      setLibraryQuestions(getBankQuestions());
      setSelectedLibraryQuestionIds([]);
    }
  }, [showLibraryModal]);

  const filteredLibraryQuestions = libraryQuestions.filter(q => 
    q.text.toLowerCase().includes(librarySearch.toLowerCase()) ||
    (q.subject && q.subject.toLowerCase().includes(librarySearch.toLowerCase()))
  );

  const handleToggleLibrarySelection = (qId: string) => {
    setSelectedLibraryQuestionIds(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleAddSelectedFromLibrary = () => {
    const questionsToAdd = libraryQuestions
      .filter(q => selectedLibraryQuestionIds.includes(q.id))
      .map(q => ({
        ...q,
        id: Math.random().toString(36).substr(2, 9),
      }));
    
    setQuestions(prev => [...prev, ...questionsToAdd]);
    setShowLibraryModal(false);
    setSelectedLibraryQuestionIds([]);
  };

  const [currentQuestion, setCurrentQuestion] = useState<{
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleQuestionChange = (field: string, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (currentQuestion.options.length <= 2) return; // Minimum 2 options
    
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    
    // Adjust correctAnswer if needed
    let newCorrectAnswer = currentQuestion.correctAnswer;
    if (currentQuestion.correctAnswer === index) {
      newCorrectAnswer = 0; // Reset to first option if the correct one is removed
    } else if (currentQuestion.correctAnswer > index) {
      newCorrectAnswer -= 1; // Shift down if a preceding option is removed
    }

    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions,
      correctAnswer: newCorrectAnswer
    }));
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion.text.trim()) return;
    if (currentQuestion.options.some(opt => !opt.trim())) return;

    if (editingId) {
      setQuestions(questions.map(q => q.id === editingId ? {
        ...q,
        text: currentQuestion.text,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation
      } : q));
      setEditingId(null);
    } else {
      const newQuestion: Question = {
        id: Math.random().toString(36).substr(2, 9),
        text: currentQuestion.text,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation
      };
      setQuestions([...questions, newQuestion]);
    }

    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const startEditing = (question: Question) => {
    setEditingId(question.id);
    setCurrentQuestion({
      text: question.text,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (editingId === id) {
      cancelEditing();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      questionsCount: questions.length,
      questions: questions
    });
  };

  const isQuestionValid = currentQuestion.text.trim().length > 0 && 
                          currentQuestion.options.every(opt => opt.trim().length > 0);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader 
        title={initialData ? "Edit Quiz" : "Create New Quiz"}
        subtitle={initialData ? "Modify the details of your existing assessment." : "Fill in the details below to create a new assessment for your students."}
        action={
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        }
      />
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <Input 
                label="Quiz Title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="e.g., Introduction to Physics"
                icon={<FileText className="w-4 h-4" />}
              />
            </div>

            <Select 
              label="Subject" 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange}
              options={[
                { label: 'Select a subject...', value: '' },
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Computer Science', value: 'Computer Science' },
                { label: 'History', value: 'History' },
                { label: 'Physics', value: 'Physics' },
                { label: 'English Literature', value: 'English Literature' },
                { label: 'Biology', value: 'Biology' },
              ]}
              required
            />

            <Select 
              label="Difficulty Level" 
              name="difficulty" 
              value={formData.difficulty} 
              onChange={handleChange}
              options={[
                { label: 'Easy', value: 'Easy' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Hard', value: 'Hard' },
              ]}
            />

            <Input 
              label="Duration (Minutes)" 
              name="durationMinutes" 
              type="number" 
              min="1" 
              value={formData.durationMinutes} 
              onChange={handleChange} 
              required
              icon={<Clock className="w-4 h-4" />}
            />

             <Select 
              label="Status" 
              name="status" 
              value={formData.status} 
              onChange={handleChange}
              options={[
                { label: 'Draft (Hidden from students)', value: 'DRAFT' },
                { label: 'Published (Visible to students)', value: 'PUBLISHED' },
              ]}
            />
            
            <div className="col-span-1 md:col-span-2">
                <Textarea 
                label="Description & Instructions" 
                name="description" 
                rows={3} 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Describe what this quiz covers..."
                />
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="randomizeQuestions" 
                  checked={formData.randomizeQuestions} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Randomize Question Order</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="randomizeOptions" 
                  checked={formData.randomizeOptions} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Randomize Answer Options</span>
              </label>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Questions Management Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Questions ({questions.length})</h3>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowLibraryModal(true)} className="gap-2">
                  <BookOpen className="w-4 h-4" /> Add from Library
                </Button>
                <Badge color="blue">{questions.length} Added</Badge>
              </div>
            </div>

            {/* List of Added Questions */}
            {questions.length > 0 && (
                <div className="space-y-3 mb-8">
                    {questions.map((q, idx) => (
                        <div 
                          key={q.id} 
                          className={`
                            border rounded-lg p-4 flex justify-between items-start group transition-colors
                            ${editingId === q.id ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-gray-200 hover:border-indigo-300'}
                          `}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${editingId === q.id ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                                      Q{idx + 1}
                                    </span>
                                    <p className="font-medium text-gray-900">{q.text}</p>
                                </div>
                                <div className="text-xs text-gray-500 pl-8 grid grid-cols-2 gap-x-4 gap-y-1">
                                    {q.options.map((opt, i) => (
                                        <span key={i} className={`flex items-center gap-1 ${i === q.correctAnswer ? 'text-green-600 font-medium' : ''}`}>
                                            {i === q.correctAnswer && <CheckCircle className="w-3 h-3" />}
                                            {opt}
                                        </span>
                                    ))}
                                </div>
                                {q.explanation && (
                                    <div className="mt-2 pl-8 text-xs text-indigo-600 italic">
                                        <span className="font-semibold">Explanation:</span> {q.explanation.substring(0, 100)}{q.explanation.length > 100 ? '...' : ''}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <button 
                                    type="button" 
                                    onClick={() => startEditing(q)}
                                    className={`p-1 ${editingId === q.id ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
                                    disabled={editingId === q.id}
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => removeQuestion(q.id)}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Question Form */}
            <div className={`p-6 rounded-xl border transition-colors ${editingId ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2 ${editingId ? 'text-indigo-700' : 'text-gray-900'}`}>
                    {editingId ? (
                        <><Edit className="w-4 h-4" /> Edit Question</>
                    ) : (
                        <><Plus className="w-4 h-4" /> Add New Question</>
                    )}
                </h4>
                
                <div className="space-y-4">
                    <Input 
                        placeholder="Type your question here..." 
                        value={currentQuestion.text}
                        onChange={(e) => handleQuestionChange('text', e.target.value)}
                        className="bg-white"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((opt, idx) => (
                            <div key={idx} className="relative flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Input 
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        className={`bg-white pr-10 ${currentQuestion.correctAnswer === idx ? 'border-green-500 ring-1 ring-green-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleQuestionChange('correctAnswer', idx)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 focus:outline-none"
                                        title="Mark as correct answer"
                                    >
                                        {currentQuestion.correctAnswer === idx ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {currentQuestion.options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(idx)}
                                        className="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-red-50 transition-colors"
                                        title="Remove option"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-start mt-2">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleAddOption}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Option
                        </Button>
                    </div>

                    <Textarea
                        placeholder="Explain why this is the correct answer (optional)..."
                        value={currentQuestion.explanation}
                        onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                        className="bg-white"
                        label="Answer Explanation"
                    />

                    <div className="flex justify-end pt-2 gap-3">
                        {editingId && (
                             <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={cancelEditing}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={handleSaveQuestion}
                            disabled={!isQuestionValid}
                            className="gap-2"
                        >
                            {editingId ? (
                                <><Save className="w-4 h-4" /> Update Question</>
                            ) : (
                                <><Plus className="w-4 h-4" /> Add This Question</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white p-4 -mx-6 -mb-6 rounded-b-xl shadow-inner">
            <div className="text-sm text-gray-500 mr-auto">
               Total Questions: <span className="font-bold text-gray-900">{questions.length}</span>
            </div>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2" disabled={questions.length === 0}>
              <Save className="w-4 h-4" /> {initialData ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </CardBody>

      {/* Library Modal */}
      {showLibraryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[80vh] flex flex-col">
            <CardHeader 
              title="Add from My Library" 
              subtitle="Select questions to add to your quiz."
              action={
                <button onClick={() => setShowLibraryModal(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              }
            />
            <CardBody className="flex-1 overflow-hidden flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Search library..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                />
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {filteredLibraryQuestions.length > 0 ? (
                  filteredLibraryQuestions.map(q => {
                    // Check if a question with the exact same text is already added
                    const isAdded = questions.some(addedQ => addedQ.text === q.text);
                    const isSelected = selectedLibraryQuestionIds.includes(q.id);
                    return (
                      <div 
                        key={q.id} 
                        className={`border rounded-lg p-4 flex justify-between items-start transition-colors ${
                          isAdded ? 'bg-gray-50 border-gray-200 opacity-75' : 
                          isSelected ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300 cursor-pointer' : 
                          'bg-white border-gray-200 hover:border-indigo-300 cursor-pointer'
                        }`}
                        onClick={() => !isAdded && handleToggleLibrarySelection(q.id)}
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge color="blue">{q.subject || 'General'}</Badge>
                            <Badge color={q.difficulty === 'Easy' ? 'green' : q.difficulty === 'Medium' ? 'yellow' : 'red'}>
                              {q.difficulty || 'Medium'}
                            </Badge>
                          </div>
                          <p className="font-medium text-gray-900">{q.text}</p>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                          {isAdded ? (
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Added</span>
                          ) : (
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'
                            }`}>
                              {isSelected && <CheckCircle className="w-3 h-3" />}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No questions found in your library matching your search.
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowLibraryModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSelectedFromLibrary}
                  disabled={selectedLibraryQuestionIds.length === 0}
                >
                  Add Selected ({selectedLibraryQuestionIds.length})
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </Card>
  );
};