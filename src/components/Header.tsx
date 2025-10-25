import { useEffect, useState } from 'react';
import LogoApp from './LogoApp';
import Logo from './Logo';
import { GithubIcon, MoonIcon, SunIcon } from '@components/icons';

export default function Header() {
  // Estado para modo oscuro
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  // Sincronizar con localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
      }
    }
  }, []);

  return (
    <header className="bg-primary-50 dark:bg-neutral-900 backdrop-blur-sm border-b border-primary-200 dark:border-neutral-800 shadow-sm sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo DevSandoval*/}
          <Logo className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300" />

          {/* Logo App */}
          <LogoApp
            size="md"
            className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
          />

          {/* CTA & Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sandovaldavid"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              <GithubIcon className="w-5 h-5" />
              GitHub
            </a>
            {/* Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="inline-flex items-center justify-center p-2 rounded-full bg-primary-100 dark:bg-neutral-800 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-neutral-700 hover:bg-primary-200 dark:hover:bg-neutral-700 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <MoonIcon size={20} /> : <SunIcon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
