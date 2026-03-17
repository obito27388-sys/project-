import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, Select, Badge, Textarea } from '../../components/ui';
import { getBankQuestions, saveBankQuestion, deleteBankQuestion } from '../../services/mockData';
import { Question } from '../../types';
import { Search, Plus, Edit, Trash, Save, X, CheckCircle, Circle } from 'lucide-react';

const QuestionBank: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filterSubject, setFilterSubject] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [originalQuestion, setOriginalQuestion] = useState<Question | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: '',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        subject: '',
        difficulty: 'Medium'
    });

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = () => {
        setQuestions(getBankQuestions());
    };

    const handleAddNew = () => {
        const newQuestion: Question = {
            id: Math.random().toString(36).substr(2, 9),
            text: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            subject: '',
            difficulty: 'Medium'
        };
        setCurrentQuestion(newQuestion);
        setOriginalQuestion(newQuestion);
        setIsEditing(true);
    };

    const handleEdit = (q: Question) => {
        const questionCopy = {...q, explanation: q.explanation || ''};
        setCurrentQuestion(questionCopy);
        setOriginalQuestion(questionCopy);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            deleteBankQuestion(id);
            loadQuestions();
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        saveBankQuestion(currentQuestion);
        loadQuestions();
        setIsEditing(false);
        setOriginalQuestion(null);
    };

    const handleCancel = () => {
        const hasChanges = JSON.stringify(currentQuestion) !== JSON.stringify(originalQuestion);
        if (hasChanges) {
            if (!window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
                return;
            }
        }
        setIsEditing(false);
        setOriginalQuestion(null);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = filterSubject ? q.subject === filterSubject : true;
        const matchesDifficulty = filterDifficulty ? q.difficulty === filterDifficulty : true;
        return matchesSearch && matchesSubject && matchesDifficulty;
    });

    const subjects = Array.from(new Set(questions.map(q => q.subject).filter(Boolean)));

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                 <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {getBankQuestions().find(q => q.id === currentQuestion.id) ? 'Edit Question' : 'Add New Question'}
                    </h1>
                    <Button variant="secondary" onClick={handleCancel}>
                        <X className="w-5 h-5" /> Cancel
                    </Button>
                 </div>

                 <Card>
                     <CardBody>
                         <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select 
                                    label="Subject" 
                                    required
                                    value={currentQuestion.subject}
                                    onChange={(e) => setCurrentQuestion({...currentQuestion, subject: e.target.value})}
                                    options={[
                                        { label: 'Select Subject...', value: '' },
                                        { label: 'Mathematics', value: 'Mathematics' },
                                        { label: 'Computer Science', value: 'Computer Science' },
                                        { label: 'Physics', value: 'Physics' },
                                        { label: 'History', value: 'History' },
                                        { label: 'Biology', value: 'Biology' },
                                        { label: 'Geography', value: 'Geography' },
                                        { label: 'English', value: 'English' },
                                    ]}
                                />
                                <Select 
                                    label="Difficulty" 
                                    value={currentQuestion.difficulty}
                                    onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as any})}
                                    options={[
                                        { label: 'Easy', value: 'Easy' },
                                        { label: 'Medium', value: 'Medium' },
                                        { label: 'Hard', value: 'Hard' },
                                    ]}
                                />
                            </div>

                            <Input 
                                label="Question Text"
                                required
                                value={currentQuestion.text}
                                onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                                placeholder="e.g. What is the value of Pi?"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options (Mark the correct one)</label>
                                <div className="space-y-3">
                                    {currentQuestion.options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: idx})}
                                                className={`flex-shrink-0 ${currentQuestion.correctAnswer === idx ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                                            >
                                                {currentQuestion.correctAnswer === idx ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                            </button>
                                            <Input 
                                                value={opt}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                placeholder={`Option ${idx + 1}`}
                                                className={currentQuestion.correctAnswer === idx ? 'border-green-300 ring-1 ring-green-100' : ''}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Textarea
                                label="Explanation"
                                placeholder="Explain the correct answer..."
                                value={currentQuestion.explanation}
                                onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                            />

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                                <Button type="submit" className="gap-2">
                                    <Save className="w-4 h-4" /> Save Question
                                </Button>
                            </div>
                         </form>
                     </CardBody>
                 </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
                    <p className="text-gray-600 mt-1">Manage, categorize, and organize your assessment questions.</p>
                </div>
                <Button onClick={handleAddNew} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Question
                </Button>
            </div>

            <Card>
                <CardBody>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text"
                                placeholder="Search questions..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select 
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                        >
                            <option value="">All Subjects</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select 
                             className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                             value={filterDifficulty}
                             onChange={(e) => setFilterDifficulty(e.target.value)}
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {/* List */}
                    <div className="space-y-4">
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map(q => (
                                <div key={q.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors bg-white">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge color="blue">{q.subject || 'General'}</Badge>
                                                <Badge color={q.difficulty === 'Easy' ? 'green' : q.difficulty === 'Medium' ? 'yellow' : 'red'}>
                                                    {q.difficulty || 'Medium'}
                                                </Badge>
                                            </div>
                                            <p className="font-medium text-gray-900 text-lg">{q.text}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 pl-4 border-l-2 border-gray-100 mt-2">
                                                {q.options.map((opt, idx) => (
                                                    <div key={idx} className={`flex items-center gap-2 ${idx === q.correctAnswer ? 'text-green-700 font-medium' : ''}`}>
                                                        {idx === q.correctAnswer ? <CheckCircle className="w-3 h-3 flex-shrink-0" /> : <div className="w-3 h-3" />}
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                            {q.explanation && (
                                                <p className="text-xs text-gray-500 mt-2 italic border-t pt-2 border-dashed">
                                                    <span className="font-semibold">Note:</span> {q.explanation}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2 ml-4">
                                            <button 
                                                onClick={() => handleEdit(q)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(q.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p>No questions found matching your filters.</p>
                                <Button variant="ghost" onClick={handleAddNew} className="mt-2 text-indigo-600">
                                    Add your first question
                                </Button>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default QuestionBank;