import React, { useEffect } from "react";
import { Check, X, AlertTriangle, Info } from "lucide-react";

export default function Toast({ message, onClose, type = "success" }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-green-50 text-green-800 border-green-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check size={18} className="text-green-500" />;
      case "error":
        return <X size={18} className="text-red-500" />;
      case "warning":
        return <AlertTriangle size={18} className="text-yellow-500" />;
      case "info":
        return <Info size={18} className="text-blue-500" />;
      default:
        return <Check size={18} className="text-green-500" />;
    }
  };

  return (
    <div 
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center rounded-lg border shadow-lg px-4 py-3 ${getToastStyles()}`}
      style={{ 
        animation: 'slideInUp 0.3s ease forwards'
      }}
    >
      <div className="mr-2">{getIcon()}</div>
      <div className="text-sm font-medium mr-2">{message}</div>
      <button
        onClick={onClose}
        className="ml-auto text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <X size={16} />
      </button>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}