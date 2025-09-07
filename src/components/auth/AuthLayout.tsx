import { Heart } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerLinks?: {
    text: string;
    href: string;
    linkText: string;
  }[];
}

export default function AuthLayout({ 
  title, 
  subtitle, 
  children, 
  footerLinks = [] 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            OntoMatch
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {children}

        {/* Footer Links */}
        {footerLinks.length > 0 && (
          <div className="space-y-2">
            {footerLinks.map((link, index) => (
              <p key={index} className="text-center text-sm text-gray-600">
                {link.text}{' '}
                <Link href={link.href} className="text-violet-600 hover:text-violet-500">
                  {link.linkText}
                </Link>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
