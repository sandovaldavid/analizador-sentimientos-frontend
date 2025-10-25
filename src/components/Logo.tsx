interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({
  className = '',
  showText = true,
  size = 'md',
}: LogoProps) {
  // Tamaños para el SVG y el texto
  const sizeMap = {
    xs: { svg: 16, text: 'text-xs' },
    sm: { svg: 28, text: 'text-sm' },
    md: { svg: 38, text: 'text-xl' },
    lg: { svg: 64, text: 'text-2xl' },
    xl: { svg: 96, text: 'text-4xl' },
  };
  const { svg, text } = sizeMap[size] || sizeMap['md'];

  return (
    <div className={`flex items-center gap-3`}>
      {/* Logo SVG */}
      <div className="relative">
        <svg
          width={svg}
          height={svg}
          viewBox="0 0 451 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-colors duration-300"
        >
          <circle
            cx="225.5"
            cy="225"
            r="210"
            className="stroke-accent-500 dark:stroke-accent-400"
            strokeWidth="30"
          />
          <path
            d="M309.004 148.16L337.279 173.607C362.987 196.745 375.842 208.315 375.842 223.16C375.842 238.005 362.987 249.575 337.279 272.713L309.004 298.16"
            className="stroke-primary-600 dark:stroke-primary-400"
            strokeWidth="40"
            strokeLinecap="round"
          />
          <path
            d="M258.784 101L192.557 348.162"
            className="stroke-primary-600 dark:stroke-primary-400"
            strokeWidth="40"
            strokeLinecap="round"
          />
          <path
            d="M142.338 148.16L114.064 173.607C88.3545 196.745 75.5 208.315 75.5 223.16C75.5 238.005 88.3545 249.575 114.064 272.713L142.338 298.16"
            className="stroke-primary-600 dark:stroke-primary-400"
            strokeWidth="40"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name */}
      {showText && (
        <span
          className={`font-code font-bold text-neutral-800 dark:text-neutral-100 italic ${text} ${className}`}
        >
          DevSandoval
        </span>
      )}
    </div>
  );
}
