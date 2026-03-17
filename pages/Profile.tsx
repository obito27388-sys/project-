import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, CardHeader, Button, Input } from '../components/ui';
import { Camera, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    // Negative margins to stretch full background over the default padding from Layout
    <div className="-m-4 lg:-m-8 p-4 lg:p-8 min-h-[calc(100vh-4rem)] bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Info */}
          <Card className="col-span-1 h-fit !bg-gray-800 !border-gray-700">
            <CardBody className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img 
                  src={user?.avatar || "https://picsum.photos/200"} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-lg"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-gray-400 uppercase tracking-wide mt-1">{user?.role}</p>
              <div className="mt-6 w-full pt-6 border-t border-gray-700 flex justify-between text-sm">
                <div className="text-center w-1/2 border-r border-gray-700">
                  <span className="block font-bold text-white">24</span>
                  <span className="text-gray-400">Quizzes</span>
                </div>
                <div className="text-center w-1/2">
                  <span className="block font-bold text-white">85%</span>
                  <span className="text-gray-400">Avg Score</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Edit Form */}
          <Card className="col-span-1 md:col-span-2 !bg-gray-800 !border-gray-700">
            <CardHeader 
              title="Personal Information" 
              subtitle="Update your personal details and password." 
              className="!border-gray-700 text-white"
            />
            <CardBody>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name" 
                    defaultValue={user?.name} 
                    className="!bg-gray-700 !border-gray-600 !text-white !placeholder-gray-400 focus:!ring-indigo-500 focus:!border-indigo-500"
                    labelClassName="text-gray-200"
                  />
                  <Input 
                    label="Email Address" 
                    defaultValue={user?.email} 
                    disabled 
                    className="!bg-gray-700/50 !border-gray-600 !text-gray-400"
                    labelClassName="text-gray-200"
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-white mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <Input 
                      label="Current Password" 
                      type="password" 
                      className="!bg-gray-700 !border-gray-600 !text-white focus:!ring-indigo-500 focus:!border-indigo-500"
                      labelClassName="text-gray-200"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="New Password" 
                        type="password" 
                        className="!bg-gray-700 !border-gray-600 !text-white focus:!ring-indigo-500 focus:!border-indigo-500"
                        labelClassName="text-gray-200"
                      />
                      <Input 
                        label="Confirm New Password" 
                        type="password" 
                        className="!bg-gray-700 !border-gray-600 !text-white focus:!ring-indigo-500 focus:!border-indigo-500"
                        labelClassName="text-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                   <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                     <Save className="w-4 h-4" /> Save Changes
                   </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;