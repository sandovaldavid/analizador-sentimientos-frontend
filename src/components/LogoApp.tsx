import React from 'react';

interface LogoProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: { svg: 24, text: 'text-lg' },
  md: { svg: 32, text: 'text-2xl' },
  lg: { svg: 48, text: 'text-4xl' },
};

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  ...props
}) => {
  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo SVG */}
      <svg
        width={sizeConfig.svg}
        height={sizeConfig.svg}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary-600 dark:text-primary-400"
        {...(props as React.SVGProps<SVGSVGElement>)}
      >
        {/* Brain/AI shape */}
        <path
          d="M16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Sentiment smile/arc */}
        <path
          d="M10 16C10 16 12 20 16 20C20 20 22 16 22 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left eye */}
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />

        {/* Right eye */}
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />

        {/* Accent dots */}
        <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.6" />
        <circle cx="24" cy="24" r="1" fill="currentColor" opacity="0.6" />
      </svg>

      {/* Text */}
      {showText && (
        <div className="flex flex-row items-baseline gap-2">
          <span
            className={`font-display font-bold ${sizeConfig.text} text-primary-600 dark:text-primary-400 leading-none`}
          >
            Sentiment
          </span>
          <span className="text-xs font-code text-accent-600 dark:text-accent-400 font-semibold">
            AI
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
