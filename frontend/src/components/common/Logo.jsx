import React from 'react';

const Logo = ({ width = 40, height = 40, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Outer circle - slight gradient */}
      <circle cx="20" cy="20" r="19" fill="url(#gradientBg)" strokeWidth="2" />
      
      {/* Inner "S" shape with wave pattern */}
      <path 
        d="M22.5 12C20.5 12 16 13 16 16C16 19 20.5 18.5 22.5 19.5C24.5 20.5 24 23 23 24C22 25 19 25.5 16 24" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeLinejoin="round" 
      />
      
      {/* Circular element representing "Sphere" */}
      <circle cx="25.5" cy="14.5" r="2.5" fill="#5983FC" fillOpacity="0.7" />
      <circle cx="14.5" cy="25.5" r="2.5" fill="#5983FC" fillOpacity="0.7" />
      
      {/* Radial gradient definition */}
      <defs>
        <radialGradient 
          id="gradientBg" 
          cx="0" 
          cy="0" 
          r="1" 
          gradientUnits="userSpaceOnUse" 
          gradientTransform="translate(15 15) rotate(45) scale(28.2843)"
        >
          <stop stopColor="#5983FC" />
          <stop offset="1" stopColor="#3E60C1" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Logo; 