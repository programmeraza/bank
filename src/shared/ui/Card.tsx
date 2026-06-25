import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-zinc-200 bg-white p-6 shadow-sm card-hover-effect ${className}`}>
      {children}
    </div>
  );
}