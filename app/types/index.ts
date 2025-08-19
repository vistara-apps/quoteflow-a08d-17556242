
export interface User {
  userId: string;
  farcasterId: string;
  email?: string;
  insuranceProfileId?: string;
}

export interface InsuranceProfile {
  profileId: string;
  homeAddress: string;
  autoDetails: {
    make: string;
    model: string;
    year: number;
    vin?: string;
  };
  coverageNeeds: {
    homeValue: number;
    autoValue: number;
    liabilityPreference: 'basic' | 'standard' | 'premium';
  };
  riskFactors: {
    floodZone: boolean;
    crimeFactor: 'low' | 'medium' | 'high';
    drivingRecord: 'clean' | 'minor' | 'major';
  };
  savedQuotes: Quote[];
}

export interface Quote {
  quoteId: string;
  providerName: string;
  coverageDetails: {
    homeDeductible: number;
    autoDeductible: number;
    liability: string;
    comprehensive: boolean;
    collision: boolean;
  };
  premium: {
    monthly: number;
    annual: number;
  };
  policyLink: string;
  rating: number;
}

export interface QuoteComparison {
  quotes: Quote[];
  recommendations: {
    bestValue: string;
    lowestPrice: string;
    bestCoverage: string;
  };
  savings: {
    potential: number;
    currentVs: string;
  };
}
