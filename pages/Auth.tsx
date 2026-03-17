import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card, CardBody } from '../components/ui';
import { Role } from '../types';
import { Mail, Lock, User, Briefcase, X, Zap } from 'lucide-react';

// Icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.23 3.69-1.14.87.05 1.98.51 2.72 1.57-2.47 1.4-2.12 5.05.32 6.45-.66 1.83-1.63 3.59-2.81 5.35zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

interface AuthPageProps {
  type: 'LOGIN' | 'REGISTER';
}

const AuthPage: React.FC<AuthPageProps> = ({ type }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Social Login State
  const [socialLogin, setSocialLogin] = useState<'GOOGLE' | 'APPLE' | null>(null);
  const [socialEmail, setSocialEmail] = useState('');
  const [isSocialProcessing, setIsSocialProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      if (type === 'REGISTER' && password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      if (type === 'LOGIN') {
        // Use generic passwords for demo
        const success = login(email, role);
        if (success) {
          navigate(`/${role.toLowerCase()}`);
        } else {
          setError('Invalid credentials or role mismatch. Try teacher@edu.com (TEACHER) or student@edu.com (STUDENT).');
        }
      } else {
        // Mock registration always succeeds in this demo
        login(email, role); // auto login after register
        navigate(`/${role.toLowerCase()}`);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSocialProcessing(true);
      setTimeout(() => {
          login('student@edu.com', 'STUDENT'); // Demo login
          navigate('/student');
      }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Social Login Modal */}
      {socialLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden relative">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {socialLogin === 'GOOGLE' ? <GoogleIcon /> : <AppleIcon />}
                        <span className="font-medium text-gray-700">Sign in with {socialLogin === 'GOOGLE' ? 'Google' : 'Apple'}</span>
                    </div>
                    <button 
                        onClick={() => setSocialLogin(null)} 
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-8">
                     <div className="text-center mb-8">
                        {socialLogin === 'GOOGLE' ? (
                             <div className="flex justify-center mb-4"><GoogleIcon /></div>
                        ) : (
                             <div className="flex justify-center mb-4 text-black"><AppleIcon /></div>
                        )}
                        <h3 className="text-xl font-bold text-gray-900">
                            {socialLogin === 'GOOGLE' ? 'Sign in' : 'Sign in with Apple ID'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            {socialLogin === 'GOOGLE' ? 'to continue to SyncQuiz' : 'Use your Apple ID to sign in to SyncQuiz.'}
                        </p>
                    </div>

                    <form onSubmit={handleSocialSubmit} className="space-y-6">
                        <Input 
                            label={socialLogin === 'GOOGLE' ? "Email or phone" : "Apple ID"}
                            placeholder={socialLogin === 'GOOGLE' ? "email@gmail.com" : "example@icloud.com"}
                            className="bg-white border-gray-300 text-gray-900 !rounded-md"
                            labelClassName="text-gray-600"
                            value={socialEmail}
                            onChange={(e) => setSocialEmail(e.target.value)}
                            required
                        />

                        <div className="flex justify-end">
                             <a href="#" className="text-sm text-blue-600 font-medium hover:text-blue-700">
                                {socialLogin === 'GOOGLE' ? 'Forgot email?' : 'Forgot ID?'}
                             </a>
                        </div>
                        
                        <div className="pt-2">
                             <Button 
                                fullWidth 
                                disabled={isSocialProcessing}
                                className={`
                                    py-2.5 rounded-full font-bold
                                    ${socialLogin === 'GOOGLE' 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                        : 'bg-black hover:bg-gray-800 text-white'}
                                `}
                            >
                                {isSocialProcessing ? 'Signing in...' : 'Next'}
                             </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            <Zap className="w-7 h-7 text-white" />
          </Link>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          {type === 'LOGIN' ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {type === 'LOGIN' ? 'Please enter your details to sign in.' : 'Get started with SyncQuiz today.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
          <CardBody className="py-8 px-6 sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Select Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['STUDENT', 'TEACHER'] as Role[]).map((r) => (
                    <div
                      key={r}
                      onClick={() => setRole(r)}
                      className={`
                        cursor-pointer text-center p-3 rounded-xl border-2 text-sm font-semibold transition-all
                        ${role === r 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'}
                      `}
                    >
                      <div className="mb-2 flex justify-center">
                        {r === 'STUDENT' && <User className="w-5 h-5" />}
                        {r === 'TEACHER' && <Briefcase className="w-5 h-5" />}
                      </div>
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              {type === 'REGISTER' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="First Name" 
                      type="text" 
                      required 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="!bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!ring-indigo-500 focus:!border-indigo-500"
                      labelClassName="text-slate-700 font-medium"
                    />
                    <Input 
                      label="Last Name" 
                      type="text" 
                      required 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="!bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!ring-indigo-500 focus:!border-indigo-500"
                      labelClassName="text-slate-700 font-medium"
                    />
                  </div>
                  <Input 
                    label="Phone Number" 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="!bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!ring-indigo-500 focus:!border-indigo-500"
                    labelClassName="text-slate-700 font-medium"
                  />
                </>
              )}

              <Input 
                label="Email address" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                className="!bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!ring-indigo-500 focus:!border-indigo-500"
                labelClassName="text-slate-700 font-medium"
              />

              <Input 
                label="Password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                className="!bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!ring-indigo-500 focus:!border-indigo-500"
                labelClassName="text-slate-700 font-medium"
              />

              {type === 'REGISTER' && (
                <Input 
                  label="Confirm Password" 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  className="!bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!ring-indigo-500 focus:!border-indigo-500"
                  labelClassName="text-slate-700 font-medium"
                />
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <div className="flex">
                    <div className="text-sm text-red-600 font-medium">{error}</div>
                  </div>
                </div>
              )}

              <Button type="submit" fullWidth disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-200 transition-all">
                {isLoading ? 'Processing...' : type === 'LOGIN' ? 'Sign In' : 'Create Account'}
              </Button>

              {type === 'LOGIN' && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button 
                    type="button"
                    variant="secondary" 
                    className="w-full justify-center bg-white text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-2 rounded-xl py-2.5 shadow-sm transition-all"
                    onClick={() => setSocialLogin('GOOGLE')}
                >
                    <GoogleIcon /> Google
                </Button>
                <Button 
                    type="button"
                    variant="secondary" 
                    className="w-full justify-center bg-white text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-2 rounded-xl py-2.5 shadow-sm transition-all"
                    onClick={() => setSocialLogin('APPLE')}
                >
                    <AppleIcon /> Apple
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-slate-600">
              {type === 'LOGIN' ? (
                <>
                  Don't have an account?{' '}
                  <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Already have an account? Log in
                  </Link>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;