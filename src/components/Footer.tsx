import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  WebSiteIcon,
} from '@components/icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/sandovaldavid',
      icon: GithubIcon,
      color: 'hover:text-neutral-900 dark:hover:text-neutral-50',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/devsandoval',
      icon: LinkedinIcon,
      color: 'hover:text-primary-600 dark:hover:text-primary-400',
    },
    {
      name: 'X',
      href: 'https://x.com/dev_sandoval',
      icon: TwitterIcon,
      color: 'hover:text-neutral-900 dark:hover:text-neutral-400',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/dev.sandoval',
      icon: InstagramIcon,
      color: 'hover:text-accent-600 dark:hover:text-accent-400',
    },
    {
      name: 'Web Site',
      href: 'https://linkdevs.social',
      icon: WebSiteIcon,
      color: 'hover:text-primary-600 dark:hover:text-primary-400',
    },
  ];

  return (
    <footer className="bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-sm border-t border-primary-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-neutral-600 dark:text-neutral-400 ${link.color} transition-colors duration-200`}
                aria-label={link.name}
              >
                <link.icon size={24} />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-neutral-300 dark:bg-neutral-700"></div>

          {/* Copyright & Credits */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-neutral-600 dark:text-neutral-300 text-sm flex gap-1 items-baseline ">
              Desarrollado por
              <a
                href="https://www.linkdevs.social"
                target="_blank"
                className="font-code font-semibold text-primary-600 dark:text-primary-400 inline hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
              >
                devsandoval
              </a>
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs">
              © {currentYear} devsandoval. Todos los derechos reservados.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>React</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
