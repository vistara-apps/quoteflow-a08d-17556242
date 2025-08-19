
"use client";

import { useState, useEffect } from "react";
import { Quote, QuoteComparison, InsuranceProfile } from "../types";

// Mock data for demonstration
const mockQuotes: Quote[] = [
  {
    quoteId: "q1",
    providerName: "StateWide Insurance",
    coverageDetails: {
      homeDeductible: 1000,
      autoDeductible: 500,
      liability: "300/100/50",
      comprehensive: true,
      collision: true,
    },
    premium: {
      monthly: 185,
      annual: 2220,
    },
    policyLink: "#",
    rating: 4,
  },
  {
    quoteId: "q2",
    providerName: "SafeGuard Insurance",
    coverageDetails: {
      homeDeductible: 2500,
      autoDeductible: 1000,
      liability: "250/50/25",
      comprehensive: true,
      collision: false,
    },
    premium: {
      monthly: 145,
      annual: 1740,
    },
    policyLink: "#",
    rating: 3,
  },
  {
    quoteId: "q3",
    providerName: "Premium Shield",
    coverageDetails: {
      homeDeductible: 500,
      autoDeductible: 250,
      liability: "500/250/100",
      comprehensive: true,
      collision: true,
    },
    premium: {
      monthly: 225,
      annual: 2700,
    },
    policyLink: "#",
    rating: 5,
  },
];

export function useInsuranceData() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<InsuranceProfile | null>(null);

  const fetchQuotes = async (profileData: Partial<InsuranceProfile>) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setQuotes(mockQuotes);
    setLoading(false);
  };

  const getQuoteComparison = (): QuoteComparison => {
    const sortedByPrice = [...quotes].sort((a, b) => a.premium.annual - b.premium.annual);
    const sortedByRating = [...quotes].sort((a, b) => b.rating - a.rating);
    
    return {
      quotes,
      recommendations: {
        bestValue: sortedByRating[0]?.quoteId || "",
        lowestPrice: sortedByPrice[0]?.quoteId || "",
        bestCoverage: sortedByRating[0]?.quoteId || "",
      },
      savings: {
        potential: sortedByPrice.length > 1 ? 
          sortedByPrice[sortedByPrice.length - 1].premium.annual - sortedByPrice[0].premium.annual : 0,
        currentVs: "Current Policy"
      }
    };
  };

  const saveProfile = (profileData: InsuranceProfile) => {
    setProfile(profileData);
    // In a real app, this would save to the backend
    localStorage.setItem('insuranceProfile', JSON.stringify(profileData));
  };

  const loadProfile = () => {
    const saved = localStorage.getItem('insuranceProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    quotes,
    loading,
    profile,
    fetchQuotes,
    getQuoteComparison,
    saveProfile,
  };
}
