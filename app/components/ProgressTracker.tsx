
"use client";

interface Step {
  id: string;
  label: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep: string;
}

export function ProgressTracker({ steps, currentStep }: ProgressTrackerProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.completed;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`progress-step ${
                  isCompleted ? 'completed' : isActive ? 'active' : 'inactive'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                isActive ? 'text-primary' : isCompleted ? 'text-accent' : 'text-text-secondary'
              }`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                isCompleted ? 'bg-accent' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
