/**
 * Success/Failure Notification Component
 * Displays success or error messages with auto-dismiss
 * Accessible and responsive
 */

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // in ms, 0 = no auto-dismiss
  onClose?: () => void;
  className?: string;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-black',
    iconColor: 'text-black'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-black',
    iconColor: 'text-black'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-black',
    iconColor: 'text-black'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-black',
    iconColor: 'text-black'
  }
};

export function Notification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  className = ''
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = notificationConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border rounded-lg p-4 flex items-start gap-3 shadow-md
        animate-in slide-in-from-top-2 duration-300
        ${className}
      `}
    >
      <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} aria-hidden="true" />
      
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold mb-1">{title}</h3>
        {message && <p className="text-sm">{message}</p>}
      </div>

      <button
        onClick={handleClose}
        className={`${config.textColor} hover:brightness-90 transition-all p-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current`}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// Hook for managing notifications
export function useNotification() {
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  const showNotification = (props: Omit<NotificationProps, 'onClose'>) => {
    setNotification({
      ...props,
      onClose: () => setNotification(null)
    });
  };

  const hideNotification = () => setNotification(null);

  return { notification, showNotification, hideNotification };
}
