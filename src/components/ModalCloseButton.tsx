import React from 'react';
import { X } from 'lucide-react';

interface ModalCloseButtonProps {
  onClick: () => void;
  className?: string;
}

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl ${className}`}
      title="Close"
    >
      <X className="h-5 w-5" />
    </button>
  );
};

export default ModalCloseButton;