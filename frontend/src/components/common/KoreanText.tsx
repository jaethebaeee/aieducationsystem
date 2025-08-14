import React from 'react';

interface KoreanTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'heading-1' | 'heading-2' | 'heading-3' | 'body-large' | 'body-base' | 'body-small';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'white';
}

const KoreanText: React.FC<KoreanTextProps> = ({
  children,
  className = '',
  variant = 'body-base',
  weight = 'normal',
  color = 'primary'
}) => {
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorClasses = {
    primary: 'text-neutral-900',
    secondary: 'text-neutral-600',
    muted: 'text-neutral-500',
    white: 'text-white'
  };

  const variantClasses = {
    'heading-1': 'heading-1',
    'heading-2': 'heading-2',
    'heading-3': 'heading-3',
    'body-large': 'body-large',
    'body-base': 'body-base',
    'body-small': 'body-small'
  };

  return (
    <span
      className={`
        text-korean
        ${variantClasses[variant]}
        ${weightClasses[weight]}
        ${colorClasses[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default KoreanText; 