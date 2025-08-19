
"use client";

import { Quote } from "../types";

interface QuoteCardProps {
  quote: Quote;
  variant?: "compact" | "detailed";
  isRecommended?: boolean;
  onSelect?: (quote: Quote) => void;
}

export function QuoteCard({ quote, variant = "compact", isRecommended, onSelect }: QuoteCardProps) {
  const handleSelect = () => {
    onSelect?.(quote);
  };

  return (
    <div className={`card relative ${isRecommended ? 'ring-2 ring-accent' : ''} hover:shadow-lg transition-all duration-200 cursor-pointer`} onClick={handleSelect}>
      {isRecommended && (
        <div className="absolute -top-2 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
          Recommended
        </div>
      )}
      
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
            <button className="btn-primary flex-1 text-sm py-2">
              View Details
            </button>
            <button className="btn-secondary flex-1 text-sm py-2">
              Get Quote
            </button>
          </div>
        </div>
      )}

      {variant === "compact" && (
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>{quote.coverageDetails.liability} liability</span>
          <span>
            {quote.coverageDetails.comprehensive && quote.coverageDetails.collision ? 'Full Coverage' : 'Basic Coverage'}
          </span>
        </div>
      )}
    </div>
  );
}
