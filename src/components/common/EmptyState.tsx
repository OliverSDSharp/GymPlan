interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="mb-4 text-text-muted">
          {icon}
        </div>
      )}
      <h3 className="font-heading font-bold text-lg uppercase tracking-wide text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-text-secondary max-w-xs">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
