
import React from 'react';

interface MinecraftSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const MinecraftSelect: React.FC<MinecraftSelectProps> = ({ label, children, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-lg mb-2 text-gray-300">{label}</label>
      <div className="relative">
        <select
          className="appearance-none w-full bg-gray-900 border-2 border-t-gray-500 border-l-gray-500 border-r-gray-800 border-b-gray-800 text-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
          <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MinecraftSelect;
