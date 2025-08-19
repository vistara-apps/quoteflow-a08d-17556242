
"use client";

interface CallToActionProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: "primary" | "secondary";
}

export function CallToAction({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "primary"
}: CallToActionProps) {
  return (
    <div className={`card text-center ${variant === "primary" ? "bg-gradient-to-br from-primary/5 to-accent/5" : ""}`}>
      <h3 className="heading mb-3">{title}</h3>
      <p className="body text-text-secondary mb-6">{description}</p>
      
      <div className="space-y-3">
        <button
          onClick={primaryAction.onClick}
          className="btn-primary w-full"
        >
          {primaryAction.label}
        </button>
        
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="btn-secondary w-full"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
