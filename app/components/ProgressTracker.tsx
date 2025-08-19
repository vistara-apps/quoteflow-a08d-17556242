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
  // Calculate overall progress percentage
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  return (
    <div className="mb-8">
      {/* Mobile progress bar (visible on small screens) */}
      <div className="block sm:hidden mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-primary">Progress</span>
          <span className="text-sm font-medium text-accent">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div 
            className="bg-accent h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <div className="mt-2 text-sm text-text-secondary">
          Step {steps.findIndex(step => step.id === currentStep) + 1} of {steps.length}: {steps.find(step => step.id === currentStep)?.label}
        </div>
      </div>
      
      {/* Desktop stepper (hidden on small screens) */}
      <div className="hidden sm:flex items-center justify-between" role="navigation" aria-label="Form progress">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.completed;
          const isPast = steps.findIndex(s => s.id === currentStep) > index;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative">
                <div
                  className={`progress-step ${
                    isCompleted ? 'completed' : isActive ? 'active' : 'inactive'
                  }`}
                  role="button"
                  tabIndex={isPast ? 0 : -1}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`${step.label} ${isCompleted ? '(completed)' : isActive ? '(current)' : ''}`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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
                
                {/* Tooltip for additional context */}
                {isActive && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-text-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Current step
                  </div>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`h-0.5 w-full ${
                      isCompleted ? 'bg-accent' : 'bg-border'
                    }`}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
