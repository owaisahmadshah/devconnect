import { Link } from '@tanstack/react-router';

interface AuthTemplateProps {
  children: React.ReactNode;
  title: string;
  subTitle?: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export const AuthTemplate = ({
  children,
  title,
  subTitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthTemplateProps) => {
  return (
    <div className="mx-auto flex min-h-[100vh] w-1/2 flex-col items-center justify-center pb-10 max-sm:w-full">
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Link to="/" className="flex items-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span className="ml-2 text-xl font-bold">DevConnect</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subTitle && <p>{subTitle}</p>}
        </div>

        {/* Content */}
        <div className="rounded-lg p-8 shadow-lg shadow-gray-400 dark:shadow-gray-900">
          {children}
        </div>
        {/* Footer */}
        {footerText && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {footerText}{' '}
              {footerLinkHref && (
                <Link to={footerLinkHref} className="text-blue-600 hover:underline">
                  {footerLinkText}
                </Link>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
