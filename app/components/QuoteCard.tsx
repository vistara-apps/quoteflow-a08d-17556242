"use client";

import { useState } from "react";
import { Quote } from "../types";

interface QuoteCardProps {
  quote: Quote;
  variant?: "compact" | "detailed";
  isRecommended?: boolean;
  isSelected?: boolean;
  isSaved?: boolean;
  onSelect?: (quote: Quote) => void;
  onSave?: () => void;
}

export function QuoteCard({ 
  quote, 
  variant = "compact", 
  isRecommended, 
  isSelected,
  isSaved,
  onSelect,
  onSave
}: QuoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSelect = () => {
    onSelect?.(quote);
  };
  
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.();
  };

  return (
    <div 
      className={`card relative ${isRecommended ? 'ring-2 ring-accent' : ''} ${isSelected ? 'ring-2 ring-primary' : ''} hover:shadow-lg transition-all duration-200 cursor-pointer`} 
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Insurance quote from ${quote.providerName}`}
    >
      {isRecommended && (
        <div className="absolute -top-2 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
          Recommended
        </div>
      )}
      
      {/* Save button */}
      <button
        onClick={handleSaveClick}
        className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${
          isSaved ? 'bg-accent/10 text-accent' : isHovered ? 'bg-border text-text-secondary' : 'opacity-0'
        }`}
        aria-label={isSaved ? "Remove from saved quotes" : "Save this quote"}
      >
        {isSaved ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
      </button>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="heading text-lg">{quote.providerName}</h3>
          <div className="flex items-center mt-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < quote.rating ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-text-secondary text-sm ml-2">({quote.rating}/5)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="heading text-lg text-primary">${quote.premium.monthly}/mo</div>
          <div className="text-text-secondary text-sm">${quote.premium.annual}/year</div>
        </div>
      </div>

      {variant === "detailed" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Home Deductible:</span>
              <div className="font-semibold">${quote.coverageDetails.homeDeductible}</div>
            </div>
            <div>
              <span className="text-text-secondary">Auto Deductible:</span>
              <div className="font-semibold">${quote.coverageDetails.autoDeductible}</div>
            </div>
            <div>
              <span className="text-text-secondary">Liability:</span>
              <div className="font-semibold">{quote.coverageDetails.liability}</div>
            </div>
            <div>
              <span className="text-text-secondary">Coverage:</span>
              <div className="font-semibold">
                {quote.coverageDetails.comprehensive && quote.coverageDetails.collision ? 'Full' : 'Basic'}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button 
              className="btn-primary flex-1 text-sm py-2 flex items-center justify-center"
              aria-label="View detailed quote information"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            <button 
              className="btn-secondary flex-1 text-sm py-2 flex items-center justify-center"
              aria-label="Get this insurance quote"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Get Quote
            </button>
          </div>
        </div>
      )}

      {variant === "compact" && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-text-secondary">
          <div className="flex items-center mb-1 sm:mb-0">
            <svg className="w-4 h-4 mr-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{quote.coverageDetails.liability} liability</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>
              {quote.coverageDetails.comprehensive && quote.coverageDetails.collision ? 'Full Coverage' : 'Basic Coverage'}
            </span>
          </div>
        </div>
      )}
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}
