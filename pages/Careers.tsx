import React from 'react';
import { Button } from '../components/ui';

const Careers: React.FC = () => {
  const openPositions = [
    { role: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote' },
    { role: 'Product Designer', department: 'Design', location: 'New York, NY' },
    { role: 'Customer Success Manager', department: 'Support', location: 'London, UK' },
    { role: 'Marketing Specialist', department: 'Marketing', location: 'Remote' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Join Our Team</h1>
          <p className="mt-4 text-xl text-gray-600">Help us shape the future of education technology.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Open Positions</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {openPositions.map((job, index) => (
              <li key={index} className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{job.role}</h4>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <span>{job.department}</span>
                    <span>&bull;</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <Button className="bg-gray-900 hover:bg-blue-600 text-white transition-colors">
                  Apply Now
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center bg-indigo-50 rounded-2xl p-12 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't see a perfect fit?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button className="bg-gray-900 hover:bg-blue-600 text-white transition-colors px-8 py-3 rounded-xl font-medium">
            Submit Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Careers;
