
import React from 'react';

interface MinecraftInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const MinecraftInput: React.FC<MinecraftInputProps> = ({ label, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-lg mb-2 text-gray-300">{label}</label>
      <input
        className="w-full bg-gray-900 border-2 border-t-gray-500 border-l-gray-500 border-r-gray-800 border-b-gray-800 text-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        {...props}
      />
    </div>
  );
};

export default MinecraftInput;
