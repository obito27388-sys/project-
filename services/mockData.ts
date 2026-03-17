import type { User, Quiz, Attempt, Question } from '../types';

const USERS_KEY = 'syncquiz_users';
const QUIZZES_KEY = 'syncquiz_quizzes';
const ATTEMPTS_KEY = 'syncquiz_attempts';
const QUESTIONS_KEY = 'syncquiz_questions';

const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@edu.com', role: 'ADMIN', joinedAt: '2023-01-01', avatar: 'https://picsum.photos/200' },
  { id: '2', name: 'Mrs. Krabappel', email: 'teacher@edu.com', role: 'TEACHER', joinedAt: '2023-02-15', avatar: 'https://picsum.photos/201' },
  { id: '3', name: 'Saurav Rana', email: 'student@edu.com', role: 'STUDENT', joinedAt: '2023-03-10', avatar: 'https://picsum.photos/202' },
];

const SAMPLE_QUESTIONS_REACT: Question[] = [
  { 
    id: 'q1', 
    text: 'What is the Virtual DOM?', 
    options: ['A direct copy of the HTML DOM', 'A lightweight JavaScript representation of the DOM', 'A browser plugin', 'A new HTML5 element'], 
    correctAnswer: 1, 
    explanation: 'The Virtual DOM is a lightweight copy of the actual DOM in memory. React uses it to optimize updates by comparing the new Virtual DOM with the previous one (diffing) and only updating the changed parts.',
    subject: 'Computer Science', 
    difficulty: 'Medium' 
  },
  { 
    id: 'q2', 
    text: 'Which hook is used to manage state in a functional component?', 
    options: ['useEffect', 'useContext', 'useState', 'useReducer'], 
    correctAnswer: 2, 
    explanation: 'useState is the primary hook for adding state variables to functional components.',
    subject: 'Computer Science', 
    difficulty: 'Easy' 
  },
  { 
    id: 'q3', 
    text: 'What is JSX?', 
    options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Xylophone', 'JavaScript Xeroxing'], 
    correctAnswer: 0, 
    explanation: 'JSX stands for JavaScript XML. It allows us to write HTML-like elements in JavaScript code.',
    subject: 'Computer Science', 
    difficulty: 'Medium' 
  },
  { 
    id: 'q4', 
    text: 'How do you pass data to a child component?', 
    options: ['State', 'Props', 'Context', 'Redux'], 
    correctAnswer: 1, 
    explanation: 'Props (short for properties) are the mechanism to pass data from a parent component down to a child component.',
    subject: 'Computer Science', 
    difficulty: 'Easy' 
  },
];

const SAMPLE_QUESTIONS_CALCULUS: Question[] = [
  { 
    id: 'm1', 
    text: 'What is the derivative of x^2?', 
    options: ['x', '2x', 'x^2', '2'], 
    correctAnswer: 1, 
    explanation: 'Using the power rule d/dx(x^n) = nx^(n-1), the derivative of x^2 is 2x^(2-1) = 2x.',
    subject: 'Mathematics', 
    difficulty: 'Easy' 
  },
  { 
    id: 'm2', 
    text: 'What is the integral of 2x?', 
    options: ['x^2 + C', '2x^2', 'x + C', 'x^2'], 
    correctAnswer: 0, 
    explanation: 'The anti-derivative of 2x is x^2. Since it is an indefinite integral, we add the constant C.',
    subject: 'Mathematics', 
    difficulty: 'Medium' 
  },
];

const DEFAULT_QUIZZES: Quiz[] = [
  { 
    id: '101', 
    title: 'Introduction to React', 
    subject: 'Computer Science', 
    description: 'Basics of components, state, and props.', 
    questionsCount: 4, 
    durationMinutes: 15, 
    createdBy: 'Mrs. Krabappel', 
    createdAt: '2023-10-01', 
    status: 'PUBLISHED', 
    difficulty: 'Medium',
    questions: SAMPLE_QUESTIONS_REACT
  },
  { 
    id: '102', 
    title: 'Advanced Calculus', 
    subject: 'Mathematics', 
    description: 'Derivatives and Integrals deep dive.', 
    questionsCount: 2, 
    durationMinutes: 45, 
    createdBy: 'Mrs. Krabappel', 
    createdAt: '2023-10-05', 
    status: 'PUBLISHED', 
    difficulty: 'Hard',
    questions: SAMPLE_QUESTIONS_CALCULUS
  },
  { 
    id: '103', 
    title: 'World History 101', 
    subject: 'History', 
    description: 'Major events of the 20th century.', 
    questionsCount: 0, 
    durationMinutes: 30, 
    createdBy: 'Mr. Skinner', 
    createdAt: '2023-09-20', 
    status: 'DRAFT', 
    difficulty: 'Easy',
    questions: []
  },
];

const DEFAULT_ATTEMPTS: Attempt[] = [
  { 
    id: 'a1', 
    quizId: '101', 
    quizTitle: 'Introduction to React', 
    studentId: '3', 
    score: 3, 
    maxScore: 4, 
    date: '2023-10-10', 
    passed: true,
    answers: { 'q1': 1, 'q2': 2, 'q3': 1, 'q4': 1 } // q3 wrong
  },
  { 
    id: 'a2', 
    quizId: '102', 
    quizTitle: 'Advanced Calculus', 
    studentId: '3', 
    score: 1, 
    maxScore: 2, 
    date: '2023-10-12', 
    passed: false,
    answers: { 'm1': 1, 'm2': 3 } // m2 wrong
  },
];

export const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  } else {
    // Migrate existing user name if it's the old one
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    let updated = false;
    const updatedUsers = users.map((u: User) => {
      if (u.id === '3' && (u.name === 'Bart Simpson' || u.name === 'Saurav rana')) {
        updated = true;
        return { ...u, name: 'Saurav Rana' };
      }
      return u;
    });
    if (updated) {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    }
    
    // Also update current user if they are logged in
    const currentUserStr = localStorage.getItem('syncquiz_current_user');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === '3' && (currentUser.name === 'Bart Simpson' || currentUser.name === 'Saurav rana')) {
        localStorage.setItem('syncquiz_current_user', JSON.stringify({ ...currentUser, name: 'Saurav Rana' }));
      }
    }
  }
  if (!localStorage.getItem(QUIZZES_KEY)) {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(DEFAULT_QUIZZES));
  }
  if (!localStorage.getItem(ATTEMPTS_KEY)) {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(DEFAULT_ATTEMPTS));
  }
  if (!localStorage.getItem(QUESTIONS_KEY)) {
      const bankQuestions: Question[] = [
          ...SAMPLE_QUESTIONS_REACT,
          ...SAMPLE_QUESTIONS_CALCULUS,
          { 
            id: 'g1', 
            text: 'What is the capital of France?', 
            options: ['London', 'Berlin', 'Paris', 'Madrid'], 
            correctAnswer: 2, 
            explanation: 'Paris is the capital and most populous city of France.',
            subject: 'Geography', 
            difficulty: 'Easy' 
          },
          {
            id: 'g2',
            text: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correctAnswer: 1,
            explanation: 'Mars is often called the Red Planet due to the iron oxide prevalent on its surface.',
            subject: 'Science',
            difficulty: 'Easy'
          }
      ];
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(bankQuestions));
  } else {
      // Migrate to add the new question if it doesn't exist
      const existingQuestions = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]');
      if (!existingQuestions.some((q: Question) => q.id === 'g2')) {
          existingQuestions.push({
            id: 'g2',
            text: 'Which planet is known as the Red Planet?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correctAnswer: 1,
            explanation: 'Mars is often called the Red Planet due to the iron oxide prevalent on its surface.',
            subject: 'Science',
            difficulty: 'Easy'
          });
          localStorage.setItem(QUESTIONS_KEY, JSON.stringify(existingQuestions));
      }
  }
};

export const getUsers = (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
export const getQuizzes = (): Quiz[] => JSON.parse(localStorage.getItem(QUIZZES_KEY) || '[]');
export const getAttempts = (): Attempt[] => JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '[]');

export const getBankQuestions = (): Question[] => JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]');

export const saveBankQuestion = (question: Question) => {
    const questions = getBankQuestions();
    const index = questions.findIndex(q => q.id === question.id);
    if (index !== -1) {
        questions[index] = question;
    } else {
        questions.push(question);
    }
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const deleteBankQuestion = (id: string) => {
    const questions = getBankQuestions().filter(q => q.id !== id);
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const getAttemptsForStudent = (studentId: string): Attempt[] => {
  return getAttempts().filter(a => a.studentId === studentId);
};

export const saveAttempt = (attempt: Attempt) => {
  const attempts = getAttempts();
  attempts.unshift(attempt); // Add to beginning
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
};

export const addQuiz = (quiz: Quiz) => {
  const quizzes = getQuizzes();
  quizzes.push(quiz);
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
};

export const updateQuiz = (updatedQuiz: Quiz) => {
  const quizzes = getQuizzes();
  const index = quizzes.findIndex(q => q.id === updatedQuiz.id);
  if (index !== -1) {
    quizzes[index] = updatedQuiz;
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  }
};

export const deleteQuiz = (id: string) => {
  const quizzes = getQuizzes().filter(q => q.id !== id);
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
};