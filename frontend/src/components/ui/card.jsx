import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  footer,
  ...props 
}) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-300/70 overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
