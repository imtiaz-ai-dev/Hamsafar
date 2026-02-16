
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  multiline?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, multiline, className = '', ...props }) => {
  const inputStyles = `w-full px-4 py-3 bg-white border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-semibold text-slate-600 ml-1">{label}</label>
      {multiline ? (
        <textarea 
          className={`${inputStyles} min-h-[100px] resize-none`} 
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input className={inputStyles} {...props} />
      )}
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
};

export default Input;
