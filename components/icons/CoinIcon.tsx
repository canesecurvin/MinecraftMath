
import React from 'react';

const CoinIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill="#FBBF24" d="M4 4H16V16H4z" />
      <path fill="#FDE047" d="M5 5H15V15H5z" />
      <path fill="#FBBF24" d="M6 6H14V14H6z" />
      <path fill="#A16207" d="M9 7H11V13H9z" />
      <path fill="#A16207" d="M7 9H13V11H7z" />
      <path fill="#FDE047" d="M9 9H11V11H9z" />
    </svg>
  );
};

export default CoinIcon;
