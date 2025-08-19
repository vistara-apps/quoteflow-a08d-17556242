"use client";

import { type ReactNode, createContext, useContext, useState, useEffect } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

// Create a context for theme management
type ThemeContextType = {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false,
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export function Providers(props: { children: ReactNode }) {
  // Initialize theme from localStorage or default to system
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Effect to initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  // Effect to apply theme changes
  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
    
    // Determine if dark mode should be applied
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldApplyDark = theme === 'dark' || (theme === 'system' && isSystemDark);
    
    // Update state
    setIsDarkMode(shouldApplyDark);
    
    // Apply theme to document
    if (shouldApplyDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setIsDarkMode(mediaQuery.matches);
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            mode: theme === 'system' ? 'auto' : theme,
            theme: "quoteflow-theme",
            name: "QuoteFlow",
            logo: process.env.NEXT_PUBLIC_ICON_URL,
          },
        }}
      >
        {props.children}
      </MiniKitProvider>
    </ThemeContext.Provider>
  );
}
