# SyncQuiz Project Structure

This document outlines the folder and file structure of the SyncQuiz application to help developers easily understand the architecture. This file is for documentation purposes only and is not visible to users on the live website.

## Directory Tree

```text
/
├── components/           # Reusable UI and functional components
│   ├── CreateQuizForm.tsx # Form used by teachers to create and edit quizzes
│   ├── Layout.tsx         # Main application layout wrapper (navigation, footer)
│   └── ui.tsx             # Shared, generic UI components (Buttons, Cards, Inputs, Badges)
│
├── context/              # React Context providers for global state
│   └── AuthContext.tsx    # Manages user authentication state and login/logout logic
│
├── pages/                # Top-level page components (Routes)
│   ├── dashboards/       # Role-specific dashboard views
│   │   ├── AdminDashboard.tsx   # Dashboard for administrators
│   │   ├── QuestionBank.tsx     # Teacher's library of saved questions
│   │   ├── StudentDashboard.tsx # Student view for taking quizzes and viewing progress
│   │   └── TeacherDashboard.tsx # Teacher view for managing quizzes
│   │
│   ├── AboutUs.tsx       # About Us page
│   ├── Auth.tsx          # Login and registration page
│   ├── Careers.tsx       # Careers page
│   ├── Contact.tsx       # Contact Us page
│   ├── Features.tsx      # Features overview page
│   ├── Home.tsx          # Landing page
│   ├── Leaderboard.tsx   # Student leaderboard page
│   ├── Profile.tsx       # User profile management page
│   ├── Reports.tsx       # Analytics and reports page
│   ├── StudentQuizzes.tsx# Student's past quiz results
│   └── Support.tsx       # Support/Help center page
│
├── services/             # External services, API calls, and data management
│   └── mockData.ts       # LocalStorage-based mock database for users, quizzes, and attempts
│
├── types.ts              # Global TypeScript interfaces and type definitions (Quiz, User, Question, etc.)
├── App.tsx               # Main application component containing React Router setup
├── index.tsx             # React application entry point (mounts App to the DOM)
├── index.html            # Main HTML template
├── vite.config.ts        # Vite build tool configuration
├── package.json          # Project dependencies and NPM scripts
└── metadata.json         # Application metadata (name, description, permissions)
```

## Key Architectural Concepts

1. **Routing**: Handled in `App.tsx` using `react-router-dom`. Routes are protected based on the user's role (Admin, Teacher, Student) using the `AuthContext`.
2. **State Management**: Global state (like the current user) is managed via React Context (`AuthContext.tsx`). Local component state is managed using standard React hooks (`useState`, `useEffect`).
3. **Data Persistence**: Currently, data is persisted in the browser's `localStorage` via functions defined in `services/mockData.ts`. This acts as a mock backend for development.
4. **Styling**: The application uses Tailwind CSS for utility-first styling. Reusable styled components are abstracted into `components/ui.tsx`.
