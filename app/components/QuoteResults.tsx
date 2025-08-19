
"use client";

import { QuoteCard } from "./QuoteCard";
import { CallToAction } from "./CallToAction";
import { Quote, QuoteComparison } from "../types";

interface QuoteResultsProps {
  comparison: QuoteComparison;
  onSelectQuote: (quote: Quote) => void;
  onStartNew: () => void;
}

export function QuoteResults({ comparison, onSelectQuote, onStartNew }: QuoteResultsProps) {
  const { quotes, recommendations, savings } = comparison;
  
  const getRecommendedQuote = () => {
    return quotes.find(q => q.quoteId === recommendations.bestValue);
  };

  const getCheapestQuote = () => {
    return quotes.find(q => q.quoteId === recommendations.lowestPrice);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="display mb-2">Your Quote Results</h2>
        <p className="body text-text-secondary">
          We found {quotes.length} quotes from trusted providers
        </p>
      </div>

      {savings.potential > 0 && (
        <div className="card bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
          <div className="text-center">
            <h3 className="heading text-accent mb-2">Potential Savings</h3>
            <div className="display text-2xl text-primary">${savings.potential}/year</div>
            <p className="text-sm text-text-secondary">vs. highest quote</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="heading">Recommended for You</h3>
        {getRecommendedQuote() && (
          <QuoteCard
            quote={getRecommendedQuote()!}
            variant="detailed"
            isRecommended
            onSelect={onSelectQuote}
          />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="heading">All Quotes</h3>
        {quotes
          .filter(q => q.quoteId !== recommendations.bestValue)
          .map((quote) => (
            <QuoteCard
              key={quote.quoteId}
              quote={quote}
              variant="compact"
              onSelect={onSelectQuote}
            />
          ))}
      </div>

      <CallToAction
        title="Want to compare more options?"
        description="Update your preferences or get quotes for additional coverage types."
        primaryAction={{
          label: "Update Preferences",
          onClick: onStartNew,
        }}
        secondaryAction={{
          label: "Save These Quotes",
          onClick: () => {
            // Save quotes to profile
            console.log("Saving quotes...");
          },
        }}
      />

      <div className="card bg-bg border-2 border-dashed border-border">
        <div className="text-center">
          <h4 className="heading mb-2">Need Help Choosing?</h4>
          <p className="body text-text-secondary mb-4">
            Get personalized recommendations based on your specific needs and budget.
          </p>
          <button className="btn-primary">
            Get Expert Guidance - $10
          </button>
        </div>
      </div>
    </div>
  );
}
