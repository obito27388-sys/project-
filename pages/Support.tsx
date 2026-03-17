import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Select, Textarea } from '../components/ui';
import { Upload, ChevronRight, MessageSquare, Clock } from 'lucide-react';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'MY_QUERIES'>('NEW');

  // Mock data for existing queries
  const myQueries = [
    { id: '#REQ-2942', type: 'Technical Issue', status: 'Pending', date: '2024-03-10', title: 'Quiz timer not starting' },
    { id: '#REQ-1102', type: 'Account', status: 'Resolved', date: '2024-02-28', title: 'Password reset failure' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg relative">
        {/* Close button simulation if it were a modal, though it's a page here */}
        {/* <button className="absolute -top-10 right-0 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
        </button> */}

        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Support</h2>
            <p className="text-sm text-gray-500 mt-1">Report issues or request assistance from our technical team</p>
        </div>

        <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-black/5">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-gray-100/50 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('NEW')}
              className={`py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'NEW' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              New Query
            </button>
            <button
              onClick={() => setActiveTab('MY_QUERIES')}
              className={`py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'MY_QUERIES' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              My Queries
            </button>
          </div>

          <CardBody className="p-6 bg-white/50 backdrop-blur-sm">
            {activeTab === 'NEW' ? (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Query Submitted!"); }}>
                <Select 
                    label="Select Issue Type *" 
                    options={[
                        { label: 'Select an option', value: '' },
                        { label: 'Technical Issue', value: 'tech' },
                        { label: 'Billing & Account', value: 'billing' },
                        { label: 'Feedback', value: 'feedback' },
                        { label: 'Other', value: 'other' }
                    ]}
                    className="bg-white/80"
                />

                <Textarea 
                    label="Description (Optional)"
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    className="bg-white/80 resize-none"
                />

                <div className="pt-2 space-y-3">
                    <Button 
                        type="button" 
                        variant="outline" 
                        fullWidth 
                        className="border-green-500 text-green-600 hover:bg-green-50 border-dashed"
                    >
                        <Upload className="w-4 h-4 mr-2" /> Upload Screenshot
                    </Button>

                    <Button 
                        type="submit" 
                        fullWidth 
                        className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    >
                        Submit
                    </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {myQueries.map((q) => (
                    <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors cursor-pointer group shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-900 text-sm">{q.id}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                q.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {q.status}
                            </span>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-1">{q.title}</h4>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                             <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {q.type}</span>
                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {q.date}</span>
                        </div>
                    </div>
                ))}
                
                {myQueries.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No queries found.
                    </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Support;