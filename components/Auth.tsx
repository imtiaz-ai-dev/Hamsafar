
import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { User } from '../types';
import { Car, User as UserIcon, Phone } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please enter name and phone number');
      return;
    }
    
    // Check if admin login
    const isAdmin = formData.phone === '03001234567' && formData.name.toLowerCase() === 'admin';
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      phone: formData.phone,
      role: isAdmin ? 'admin' : 'customer'
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
            <Car size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Welcome to Hamsafar</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Enter your details to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="Your Name" 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Phone Number" 
            placeholder="03001234567" 
            type="tel"
            required
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
          
          <Button type="submit" className="w-full mt-6">
            Login
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">Admin: phone 03001234567, name "admin"</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
