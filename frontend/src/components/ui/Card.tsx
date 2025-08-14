import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  variant?: 'light' | 'dark';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
  onClick,
  variant = 'light'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  const borderClass = border ? 'border ' : '';
  const hoverClass = hover ? 'hover:shadow-md transition-shadow' : '';
  const variantClass = variant === 'dark'
    ? 'bg-white/5 text-white border-white/10'
    : 'bg-white text-gray-900 border-gray-200';

  const classes = `rounded-xl ${paddingClasses[padding]} ${shadowClasses[shadow]} ${borderClass} ${hoverClass} ${variantClass} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card; 