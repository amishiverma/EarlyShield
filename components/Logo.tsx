import React from 'react';

interface LogoProps {
  className?: string;
  mode?: 'mark' | 'full';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", mode = 'full', showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-full w-auto aspect-square drop-shadow-sm"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.1))' }}
      >
        <defs>
            <linearGradient id="shieldGradient" x1="6" y1="4" x2="24" y2="46" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4CC775" />
                <stop offset="1" stopColor="#1E8E3E" />
            </linearGradient>
        </defs>

        {/* Shield Rim - Thick with Gradient to simulate bevel */}
        <path 
          d="M24 4L7 11.5V22.5C7 33.5 15 42.5 24 46C33 42.5 41 33.5 41 22.5V11.5L24 4Z" 
          stroke="url(#shieldGradient)" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />

        {/* Blue Eye with Glare */}
        <circle cx="24" cy="16" r="3.5" fill="#4285F4" />
        <circle cx="23" cy="15" r="1.2" fill="white" fillOpacity="0.4" />

        {/* Graph: Red Swoosh (Entering from left, curving up) */}
        <path 
            d="M9 31 C 11 31, 15 29, 17 25" 
            stroke="#EA4335" 
            strokeWidth="4" 
            strokeLinecap="round"
        />
        <circle cx="17" cy="25" r="3.5" fill="#EA4335" />

        {/* Graph: Orange Connector (Going down slightly to middle) */}
        {/* Using a slightly darker yellow/orange for the middle section */}
        <line x1="17" y1="25" x2="25" y2="29" stroke="#F9AB00" strokeWidth="4" strokeLinecap="round" />
        <circle cx="25" cy="29" r="3.5" fill="#F9AB00" />

        {/* Graph: Yellow Arrow (Shooting up right) */}
        <path 
            d="M25 29 L 34 16" 
            stroke="#FCC934" 
            strokeWidth="4" 
            strokeLinecap="round"
        />
        {/* Arrow Head */}
        <path 
            d="M29 16 H 34 V 21" 
            stroke="#FCC934" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
      </svg>
      
      {(mode === 'full' && showText) && (
        <span className="font-display font-bold text-xl text-text-main tracking-tight">
          EarlyShield
        </span>
      )}
    </div>
  );
};

export default Logo;