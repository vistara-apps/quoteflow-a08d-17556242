
"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  usePrimaryButton,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useState, useCallback } from "react";
import { AppShell } from "./components/AppShell";
import { QuoteForm } from "./components/QuoteForm";
import { QuoteResults } from "./components/QuoteResults";
import { CallToAction } from "./components/CallToAction";
import { useInsuranceData } from "./hooks/useInsuranceData";
import { Quote, InsuranceProfile } from "./types";

type AppState = "welcome" | "form" | "results" | "profile";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [appState, setAppState] = useState<AppState>("welcome");
  
  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  
  const {
    quotes,
    loading,
    profile,
    fetchQuotes,
    getQuoteComparison,
    saveProfile,
  } = useInsuranceData();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Primary button configuration
  usePrimaryButton(
    { text: appState === "welcome" ? "Get My Quotes" : "Start New Quote" },
    () => {
      if (appState === "welcome") {
        setAppState("form");
      } else {
        setAppState("form");
      }
    }
  );

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const handleFormSubmit = async (profileData: Partial<InsuranceProfile>) => {
    await fetchQuotes(profileData);
    setAppState("results");
  };

  const handleSelectQuote = (quote: Quote) => {
    // Handle quote selection - could navigate to external provider
    openUrl(quote.policyLink);
  };

  const saveFrameButton = () => {
    if (context && !context.client.added) {
      return (
        <button
          onClick={handleAddFrame}
          className="text-accent text-sm font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Save
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center gap-1 text-sm font-medium text-accent animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Saved
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    switch (appState) {
      case "welcome":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="display mb-4">QuoteFlow</h1>
              <p className="heading text-accent mb-2">Effortless Insurance Comparison</p>
              <p className="body text-text-secondary">
                Get personalized quotes for home and auto insurance in minutes. 
                Compare coverage options and save money on your policies.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Comparison</h3>
                    <p className="text-sm text-text-secondary">Compare quotes from top providers with clear recommendations</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Coverage Education</h3>
                    <p className="text-sm text-text-secondary">Understand your options with simple explanations</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Claims Support</h3>
                    <p className="text-sm text-text-secondary">Get guidance when you need to file a claim</p>
                  </div>
                </div>
              </div>
            </div>

            <CallToAction
              title="Ready to find better insurance?"
              description="Get personalized quotes in under 5 minutes. Pay-per-comparison reports start at just $5."
              primaryAction={{
                label: "Start Quote Comparison",
                onClick: () => setAppState("form"),
              }}
              secondaryAction={{
                label: "Learn About Coverage",
                onClick: () => {
                  // Navigate to education section
                  console.log("Navigate to education");
                },
              }}
            />
          </div>
        );

      case "form":
        return (
          <QuoteForm 
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        );

      case "results":
        return (
          <QuoteResults
            comparison={getQuoteComparison()}
            onSelectQuote={handleSelectQuote}
            onStartNew={() => setAppState("form")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <div className="w-full max-w-md mx-auto">
        <header className="flex justify-between items-center px-4 py-3 bg-surface border-b border-border">
          <div className="flex items-center space-x-2">
            <Wallet className="z-10">
              <ConnectWallet>
                <Name className="text-inherit text-sm" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
          <div>{saveFrameButton()}</div>
        </header>

        <AppShell
          title={appState !== "welcome" ? "QuoteFlow" : undefined}
          showBack={appState !== "welcome"}
          onBack={() => {
            if (appState === "form") setAppState("welcome");
            else if (appState === "results") setAppState("form");
          }}
        >
          {renderContent()}
        </AppShell>

        <footer className="px-4 py-3 text-center">
          <button
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="text-text-secondary text-xs hover:text-text-primary transition-colors"
          >
            Built on Base with MiniKit
          </button>
        </footer>
      </div>
    </div>
  );
}
