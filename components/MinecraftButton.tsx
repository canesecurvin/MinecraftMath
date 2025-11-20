
import React from 'react';

interface MinecraftButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const MinecraftButton: React.FC<MinecraftButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`bg-gray-400 text-white py-3 px-6 border-b-4 border-gray-600 hover:bg-gray-500 active:border-b-0 active:mt-1 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default MinecraftButton;
