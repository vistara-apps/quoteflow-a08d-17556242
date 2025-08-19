
"use client";

import { type ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function AppShell({ children, title, showBack, onBack }: AppShellProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-bg min-h-screen">
      {title && (
        <header className="bg-surface border-b border-border px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {showBack && (
              <button
                onClick={onBack}
                className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            <h1 className="heading text-center flex-1">{title}</h1>
            <div className="w-12"></div>
          </div>
        </header>
      )}
      <main className="px-4 py-6">
        {children}
      </main>
    </div>
  );
}
