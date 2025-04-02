import React from "react";
import { Star } from "lucide-react";

export default function Stars({ value = 0 }) {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  
  // Generate full stars
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star 
          key={i} 
          className="w-3 h-3 text-yellow-400" 
          fill="#FBBF24" 
          strokeWidth={0}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      // Half star - custom implementation with clip-path
      stars.push(
        <div key={i} className="relative w-3 h-3">
          <Star 
            className="absolute w-3 h-3 text-gray-300" 
            strokeWidth={0}
            fill="currentColor"
          />
          <div className="absolute w-1.5 h-3 overflow-hidden">
            <Star 
              className="w-3 h-3 text-yellow-400" 
              strokeWidth={0}
              fill="#FBBF24"
            />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star 
          key={i} 
          className="w-3 h-3 text-gray-300" 
          strokeWidth={0}
          fill="currentColor"
        />
      );
    }
  }

  return <div className="flex gap-0.5">{stars}</div>;
}