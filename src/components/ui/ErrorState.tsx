import { useNavigate } from 'react-router-dom';
import Button from './Button';
import EmptyState from './EmptyState';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  showBackHome?: boolean;
  backHomeLabel?: string;
  className?: string;
}

const ErrorState = ({
  title = 'Something went wrong',
  description = 'We ran into an unexpected problem. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  showBackHome = false,
  backHomeLabel = 'Back Home',
  className = '',
}: ErrorStateProps) => {
  const navigate = useNavigate();
  const showAction = Boolean(onRetry) || showBackHome;

  return (
    <EmptyState
      tone="error"
      title={title}
      description={description}
      className={className}
      action={
        showAction ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <Button onClick={onRetry} variant="secondary">
                {retryLabel}
              </Button>
            )}
            {showBackHome && (
              <Button variant="ghost" onClick={() => navigate('/')}>
                {backHomeLabel}
              </Button>
            )}
          </div>
        ) : undefined
      }
    />
  );
};

export default ErrorState;