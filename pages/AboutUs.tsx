import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">About Us</h1>
          <p className="mt-4 text-xl text-gray-400">Empowering education through technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              At SyncQuiz, our mission is to make learning accessible, engaging, and measurable for everyone. We believe that technology can bridge the gap between teaching and learning, providing tools that empower educators and inspire students to achieve their full potential.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-gray-400 leading-relaxed">
              Founded in 2024, SyncQuiz started with a simple idea: assessments shouldn't be a chore. A group of passionate educators and technologists came together to build a platform that transforms traditional quizzes into interactive, insightful experiences. Today, we serve thousands of schools worldwide.
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Core Values</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
            <p className="text-gray-400">
              We constantly push the boundaries of what's possible in edtech, embracing new ideas and technologies to improve the learning experience.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Accessibility</h3>
            <p className="text-gray-400">
              Education is a right, not a privilege. We design our tools to be inclusive and accessible to learners of all abilities and backgrounds.
            </p>
          </div>
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Impact</h3>
            <p className="text-gray-400">
              We measure our success by the positive impact we have on students' lives and teachers' workflows. Every feature we build serves this goal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
