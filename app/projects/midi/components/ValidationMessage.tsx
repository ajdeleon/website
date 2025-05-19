import { ReactNode } from 'react';

interface ValidationMessageProps {
  type: 'error' | 'warning' | 'info';
  children: ReactNode;
}

const styles = {
  error: 'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

const icons = {
  error: '⚠️',
  warning: '⚡',
  info: 'ℹ️',
};

export default function ValidationMessage({ type, children }: ValidationMessageProps) {
  return (
    <div className={`${styles[type]} border rounded-md px-3 py-2 text-sm flex items-start space-x-2`}>
      <span className="flex-shrink-0">{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}