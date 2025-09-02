import React from 'react'
import { cn } from '@/shared/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightElement,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <input
          className={cn(
            'appearance-none relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-200',
            icon ? 'pl-10' : 'pl-3',
            rightElement ? 'pr-10' : 'pr-3',
            'py-3 text-sm',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          suppressHydrationWarning={true}
          {...props}
        />
        
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default Input
