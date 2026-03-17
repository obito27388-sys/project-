export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  joinedAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option (0-3)
  explanation?: string; // Explanation for the correct answer
  subject?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  questionsCount: number;
  durationMinutes: number;
  createdBy: string; // Teacher Name
  createdAt: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions?: Question[];
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
}

export interface Attempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  score: number;
  maxScore: number;
  date: string;
  passed: boolean;
  answers?: Record<string, number>; // questionId -> selectedOptionIndex
}

export interface Stat {
  label: string;
  value: string | number;
  change?: string;
  icon?: any;
}