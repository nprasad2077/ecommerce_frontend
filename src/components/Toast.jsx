import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white py-2 px-4 rounded-xl shadow-lg z-50">
      {message}
    </div>
  );
}
