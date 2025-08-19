
"use client";

import { useState } from "react";
import { InputGroup } from "./InputGroup";
import { ProgressTracker } from "./ProgressTracker";
import { InsuranceProfile } from "../types";

interface QuoteFormProps {
  onSubmit: (data: Partial<InsuranceProfile>) => void;
  loading?: boolean;
}

export function QuoteForm({ onSubmit, loading }: QuoteFormProps) {
  const [currentStep, setCurrentStep] = useState("personal");
  const [formData, setFormData] = useState({
    homeAddress: "",
    homeValue: 0,
    autoMake: "",
    autoModel: "",
    autoYear: new Date().getFullYear(),
    autoValue: 0,
    liabilityPreference: "",
    floodZone: false,
    crimeFactor: "",
    drivingRecord: "",
  });

  const steps = [
    { id: "personal", label: "Home Info", completed: false },
    { id: "auto", label: "Auto Info", completed: false },
    { id: "preferences", label: "Preferences", completed: false },
  ];

  const updateStepCompletion = () => {
    return steps.map(step => ({
      ...step,
      completed: step.id === "personal" ? !!formData.homeAddress :
                 step.id === "auto" ? !!formData.autoMake :
                 step.id === "preferences" ? !!formData.liabilityPreference : false
    }));
  };

  const handleNext = () => {
    if (currentStep === "personal") setCurrentStep("auto");
    else if (currentStep === "auto") setCurrentStep("preferences");
    else handleSubmit();
  };

  const handleBack = () => {
    if (currentStep === "auto") setCurrentStep("personal");
    else if (currentStep === "preferences") setCurrentStep("auto");
  };

  const handleSubmit = () => {
    const profileData: Partial<InsuranceProfile> = {
      homeAddress: formData.homeAddress,
      autoDetails: {
        make: formData.autoMake,
        model: formData.autoModel,
        year: formData.autoYear,
      },
      coverageNeeds: {
        homeValue: formData.homeValue,
        autoValue: formData.autoValue,
        liabilityPreference: formData.liabilityPreference as 'basic' | 'standard' | 'premium',
      },
      riskFactors: {
        floodZone: formData.floodZone,
        crimeFactor: formData.crimeFactor as 'low' | 'medium' | 'high',
        drivingRecord: formData.drivingRecord as 'clean' | 'minor' | 'major',
      },
    };
    onSubmit(profileData);
  };

  const canProceed = () => {
    if (currentStep === "personal") return !!formData.homeAddress;
    if (currentStep === "auto") return !!formData.autoMake && !!formData.autoModel;
    if (currentStep === "preferences") return !!formData.liabilityPreference;
    return false;
  };

  return (
    <div className="space-y-6">
      <ProgressTracker steps={updateStepCompletion()} currentStep={currentStep} />

      {currentStep === "personal" && (
        <div className="space-y-4">
          <h2 className="heading">Tell us about your home</h2>
          <InputGroup
            label="Home Address"
            placeholder="123 Main St, City, State"
            value={formData.homeAddress}
            onChange={(value) => setFormData({...formData, homeAddress: value as string})}
            required
          />
          <InputGroup
            label="Estimated Home Value"
            type="number"
            placeholder="500000"
            value={formData.homeValue}
            onChange={(value) => setFormData({...formData, homeValue: value as number})}
            hint="This helps us find appropriate coverage limits"
          />
        </div>
      )}

      {currentStep === "auto" && (
        <div className="space-y-4">
          <h2 className="heading">Tell us about your vehicle</h2>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Make"
              placeholder="Toyota"
              value={formData.autoMake}
              onChange={(value) => setFormData({...formData, autoMake: value as string})}
              required
            />
            <InputGroup
              label="Model"
              placeholder="Camry"
              value={formData.autoModel}
              onChange={(value) => setFormData({...formData, autoModel: value as string})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Year"
              type="number"
              value={formData.autoYear}
              onChange={(value) => setFormData({...formData, autoYear: value as number})}
              required
            />
            <InputGroup
              label="Estimated Value"
              type="number"
              placeholder="25000"
              value={formData.autoValue}
              onChange={(value) => setFormData({...formData, autoValue: value as number})}
            />
          </div>
        </div>
      )}

      {currentStep === "preferences" && (
        <div className="space-y-4">
          <h2 className="heading">Coverage preferences</h2>
          <InputGroup
            label="Liability Coverage Level"
            type="dropdown"
            value={formData.liabilityPreference}
            onChange={(value) => setFormData({...formData, liabilityPreference: value as string})}
            options={[
              { value: "basic", label: "Basic - State Minimum" },
              { value: "standard", label: "Standard - Recommended" },
              { value: "premium", label: "Premium - Maximum Protection" },
            ]}
            required
          />
          <InputGroup
            label="Crime Risk in Area"
            type="dropdown"
            value={formData.crimeFactor}
            onChange={(value) => setFormData({...formData, crimeFactor: value as string})}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
          <InputGroup
            label="Driving Record"
            type="dropdown"
            value={formData.drivingRecord}
            onChange={(value) => setFormData({...formData, drivingRecord: value as string})}
            options={[
              { value: "clean", label: "Clean Record" },
              { value: "minor", label: "Minor Violations" },
              { value: "major", label: "Major Violations" },
            ]}
          />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        {currentStep !== "personal" && (
          <button onClick={handleBack} className="btn-secondary flex-1">
            Back
          </button>
        )}
        <button 
          onClick={handleNext} 
          disabled={!canProceed() || loading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Getting Quotes..." : currentStep === "preferences" ? "Get My Quotes" : "Next"}
        </button>
      </div>
    </div>
  );
}
