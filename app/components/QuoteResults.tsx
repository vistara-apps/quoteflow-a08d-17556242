"use client";

import { useState, useEffect } from "react";
import { QuoteCard } from "./QuoteCard";
import { CallToAction } from "./CallToAction";
import { Quote, QuoteComparison } from "../types";

interface QuoteResultsProps {
  comparison: QuoteComparison;
  onSelectQuote: (quote: Quote) => void;
  onStartNew: () => void;
}

// Skeleton loader for quote cards
function QuoteCardSkeleton({ variant = "compact" }: { variant?: "compact" | "detailed" }) {
  return (
    <div className={`card animate-pulse ${variant === "detailed" ? "relative" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-full max-w-[150px]">
          <div className="h-6 bg-border rounded w-3/4 mb-2"></div>
          <div className="flex items-center mt-1">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-border rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-border rounded w-20 mb-1"></div>
          <div className="h-4 bg-border rounded w-16"></div>
        </div>
      </div>
      
      {variant === "detailed" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-border rounded w-24 mb-1"></div>
              <div className="h-5 bg-border rounded w-16"></div>
            </div>
            <div>
              <div className="h-4 bg-border rounded w-24 mb-1"></div>
              <div className="h-5 bg-border rounded w-16"></div>
            </div>
            <div>
              <div className="h-4 bg-border rounded w-24 mb-1"></div>
              <div className="h-5 bg-border rounded w-20"></div>
            </div>
            <div>
              <div className="h-4 bg-border rounded w-24 mb-1"></div>
              <div className="h-5 bg-border rounded w-12"></div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <div className="h-10 bg-border rounded flex-1"></div>
            <div className="h-10 bg-border rounded flex-1"></div>
          </div>
        </div>
      )}
      
      {variant === "compact" && (
        <div className="flex items-center justify-between">
          <div className="h-4 bg-border rounded w-24"></div>
          <div className="h-4 bg-border rounded w-28"></div>
        </div>
      )}
    </div>
  );
}

export function QuoteResults({ comparison, onSelectQuote, onStartNew }: QuoteResultsProps) {
  const { quotes, recommendations, savings } = comparison;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'recommended' | 'price' | 'rating'>('recommended');
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getRecommendedQuote = () => {
    return quotes.find(q => q.quoteId === recommendations.bestValue);
  };

  const getCheapestQuote = () => {
    return quotes.find(q => q.quoteId === recommendations.lowestPrice);
  };
  
  const handleQuoteSelect = (quote: Quote) => {
    setSelectedQuoteId(quote.quoteId);
    onSelectQuote(quote);
  };
  
  const handleSaveQuote = (quoteId: string) => {
    setSavedQuotes(prev => {
      if (prev.includes(quoteId)) {
        return prev.filter(id => id !== quoteId);
      } else {
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 3000);
        return [...prev, quoteId];
      }
    });
  };
  
  const getSortedQuotes = () => {
    const filteredQuotes = quotes.filter(q => q.quoteId !== recommendations.bestValue);
    
    switch (sortOption) {
      case 'price':
        return [...filteredQuotes].sort((a, b) => a.premium.annual - b.premium.annual);
      case 'rating':
        return [...filteredQuotes].sort((a, b) => b.rating - a.rating);
      default:
        return filteredQuotes;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in">
        <h2 className="display mb-2">Your Quote Results</h2>
        <p className="body text-text-secondary">
          {isLoading ? "Finding the best quotes for you..." : `We found ${quotes.length} quotes from trusted providers`}
        </p>
      </div>

      {/* Savings Card */}
      {isLoading ? (
        <div className="card bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 animate-pulse">
          <div className="text-center">
            <div className="h-6 bg-accent/20 rounded w-40 mx-auto mb-2"></div>
            <div className="h-8 bg-primary/20 rounded w-28 mx-auto mb-1"></div>
            <div className="h-4 bg-border rounded w-32 mx-auto"></div>
          </div>
        </div>
      ) : (
        savings.potential > 0 && (
          <div className="card bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 animate-fade-in">
            <div className="text-center">
              <h3 className="heading text-accent mb-2">Potential Savings</h3>
              <div className="display text-2xl text-primary">${savings.potential}/year</div>
              <p className="text-sm text-text-secondary">vs. highest quote</p>
            </div>
          </div>
        )
      )}

      {/* Recommended Quote Section */}
      <div className="space-y-4">
        <h3 className="heading">Recommended for You</h3>
        {isLoading ? (
          <QuoteCardSkeleton variant="detailed" />
        ) : (
          getRecommendedQuote() && (
            <QuoteCard
              quote={getRecommendedQuote()!}
              variant="detailed"
              isRecommended
              onSelect={handleQuoteSelect}
              isSelected={selectedQuoteId === getRecommendedQuote()?.quoteId}
              isSaved={savedQuotes.includes(getRecommendedQuote()!.quoteId)}
              onSave={() => handleSaveQuote(getRecommendedQuote()!.quoteId)}
            />
          )
        )}
      </div>

      {/* All Quotes Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="heading">All Quotes</h3>
          
          {!isLoading && (
            <div className="relative">
              <select 
                className="input-field text-sm py-1 pr-8"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                aria-label="Sort quotes by"
              >
                <option value="recommended">Recommended</option>
                <option value="price">Lowest Price</option>
                <option value="rating">Highest Rating</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <>
            <QuoteCardSkeleton variant="compact" />
            <QuoteCardSkeleton variant="compact" />
          </>
        ) : (
          getSortedQuotes().map((quote) => (
            <QuoteCard
              key={quote.quoteId}
              quote={quote}
              variant="compact"
              onSelect={handleQuoteSelect}
              isSelected={selectedQuoteId === quote.quoteId}
              isSaved={savedQuotes.includes(quote.quoteId)}
              onSave={() => handleSaveQuote(quote.quoteId)}
            />
          ))
        )}
      </div>

      {/* Call to Action */}
      <CallToAction
        title="Want to compare more options?"
        description="Update your preferences or get quotes for additional coverage types."
        primaryAction={{
          label: "Update Preferences",
          onClick: onStartNew,
        }}
        secondaryAction={{
          label: savedQuotes.length > 0 ? `${savedQuotes.length} Quote${savedQuotes.length > 1 ? 's' : ''} Saved` : "Save All Quotes",
          onClick: () => {
            if (savedQuotes.length === 0) {
              // Save all quotes
              setSavedQuotes(quotes.map(q => q.quoteId));
              setShowSavedMessage(true);
              setTimeout(() => setShowSavedMessage(false), 3000);
            }
          },
        }}
      />

      {/* Expert Guidance Card */}
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
      
      {/* Saved Notification */}
      {showSavedMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-2 rounded-md shadow-lg animate-slide-up">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Quote{savedQuotes.length > 1 ? 's' : ''} saved successfully
          </div>
        </div>
      )}
    </div>
  );
}
