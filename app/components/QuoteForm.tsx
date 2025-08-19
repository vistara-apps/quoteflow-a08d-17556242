"use client";

import { useState, useEffect } from "react";
import { InputGroup } from "./InputGroup";
import { ProgressTracker } from "./ProgressTracker";
import { InsuranceProfile } from "../types";

interface QuoteFormProps {
  onSubmit: (data: Partial<InsuranceProfile>) => void;
  loading?: boolean;
}

interface FormErrors {
  homeAddress?: string;
  homeValue?: string;
  autoMake?: string;
  autoModel?: string;
  autoYear?: string;
  autoValue?: string;
  liabilityPreference?: string;
  crimeFactor?: string;
  drivingRecord?: string;
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
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState({
    personal: false,
    auto: false,
    preferences: false
  });

  const steps = [
    { id: "personal", label: "Home Info", completed: false },
    { id: "auto", label: "Auto Info", completed: false },
    { id: "preferences", label: "Preferences", completed: false },
  ];

  // Load saved form data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('quoteFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
  }, []);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('quoteFormData', JSON.stringify(formData));
  }, [formData]);

  // Validate form data
  const validateForm = (step: string) => {
    const newErrors: FormErrors = {};
    
    if (step === "personal") {
      if (!formData.homeAddress) {
        newErrors.homeAddress = "Home address is required";
      }
      
      if (formData.homeValue < 0) {
        newErrors.homeValue = "Home value must be a positive number";
      }
    }
    
    if (step === "auto") {
      if (!formData.autoMake) {
        newErrors.autoMake = "Vehicle make is required";
      }
      
      if (!formData.autoModel) {
        newErrors.autoModel = "Vehicle model is required";
      }
      
      const currentYear = new Date().getFullYear();
      if (formData.autoYear < 1900 || formData.autoYear > currentYear + 1) {
        newErrors.autoYear = `Year must be between 1900 and ${currentYear + 1}`;
      }
      
      if (formData.autoValue < 0) {
        newErrors.autoValue = "Vehicle value must be a positive number";
      }
    }
    
    if (step === "preferences") {
      if (!formData.liabilityPreference) {
        newErrors.liabilityPreference = "Please select a liability coverage level";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateStepCompletion = () => {
    return steps.map(step => ({
      ...step,
      completed: step.id === "personal" ? validateForm("personal") :
                 step.id === "auto" ? validateForm("auto") :
                 step.id === "preferences" ? validateForm("preferences") : false
    }));
  };

  const handleNext = () => {
    if (currentStep === "personal") {
      setFormTouched({...formTouched, personal: true});
      if (validateForm("personal")) {
        setCurrentStep("auto");
      }
    } else if (currentStep === "auto") {
      setFormTouched({...formTouched, auto: true});
      if (validateForm("auto")) {
        setCurrentStep("preferences");
      }
    } else {
      setFormTouched({...formTouched, preferences: true});
      if (validateForm("preferences")) {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep === "auto") setCurrentStep("personal");
    else if (currentStep === "preferences") setCurrentStep("auto");
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Validate all steps before submitting
    const isPersonalValid = validateForm("personal");
    const isAutoValid = validateForm("auto");
    const isPreferencesValid = validateForm("preferences");
    
    if (isPersonalValid && isAutoValid && isPreferencesValid) {
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
      
      try {
        // For demo purposes, we'll use mock data even if API key is missing
        if (!process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 
            process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY === 'demo_key') {
          console.warn('Using mock data due to missing or demo API key');
        }
        
        onSubmit(profileData);
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({
          ...errors,
          liabilityPreference: 'There was an error processing your request. Please try again.'
        });
        setIsSubmitting(false);
      }
    } else {
      // If any step is invalid, set all steps as touched to show errors
      setFormTouched({
        personal: true,
        auto: true,
        preferences: true
      });
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === "personal") {
      return validateForm("personal");
    }
    if (currentStep === "auto") {
      return validateForm("auto");
    }
    if (currentStep === "preferences") {
      return validateForm("preferences");
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <ProgressTracker steps={updateStepCompletion()} currentStep={currentStep} />

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
        className="space-y-6"
        noValidate
      >
        {currentStep === "personal" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="heading">Tell us about your home</h2>
            <InputGroup
              id="homeAddress"
              label="Home Address"
              placeholder="123 Main St, City, State"
              value={formData.homeAddress}
              onChange={(value) => setFormData({...formData, homeAddress: value as string})}
              required
              errorMessage={formTouched.personal ? errors.homeAddress : undefined}
              validateOnBlur={formTouched.personal}
              validateOnChange={formTouched.personal}
              autoComplete="street-address"
            />
            <InputGroup
              id="homeValue"
              label="Estimated Home Value"
              type="number"
              placeholder="500000"
              value={formData.homeValue}
              onChange={(value) => setFormData({...formData, homeValue: value as number})}
              hint="This helps us find appropriate coverage limits"
              min={0}
              errorMessage={formTouched.personal ? errors.homeValue : undefined}
              validateOnBlur={formTouched.personal}
              validateOnChange={formTouched.personal}
            />
          </div>
        )}

        {currentStep === "auto" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="heading">Tell us about your vehicle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                id="autoMake"
                label="Make"
                placeholder="Toyota"
                value={formData.autoMake}
                onChange={(value) => setFormData({...formData, autoMake: value as string})}
                required
                errorMessage={formTouched.auto ? errors.autoMake : undefined}
                validateOnBlur={formTouched.auto}
                validateOnChange={formTouched.auto}
                autoComplete="off"
              />
              <InputGroup
                id="autoModel"
                label="Model"
                placeholder="Camry"
                value={formData.autoModel}
                onChange={(value) => setFormData({...formData, autoModel: value as string})}
                required
                errorMessage={formTouched.auto ? errors.autoModel : undefined}
                validateOnBlur={formTouched.auto}
                validateOnChange={formTouched.auto}
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                id="autoYear"
                label="Year"
                type="number"
                value={formData.autoYear}
                onChange={(value) => setFormData({...formData, autoYear: value as number})}
                required
                min={1900}
                max={new Date().getFullYear() + 1}
                errorMessage={formTouched.auto ? errors.autoYear : undefined}
                validateOnBlur={formTouched.auto}
                validateOnChange={formTouched.auto}
              />
              <InputGroup
                id="autoValue"
                label="Estimated Value"
                type="number"
                placeholder="25000"
                value={formData.autoValue}
                onChange={(value) => setFormData({...formData, autoValue: value as number})}
                min={0}
                errorMessage={formTouched.auto ? errors.autoValue : undefined}
                validateOnBlur={formTouched.auto}
                validateOnChange={formTouched.auto}
              />
            </div>
          </div>
        )}

        {currentStep === "preferences" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="heading">Coverage preferences</h2>
            <InputGroup
              id="liabilityPreference"
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
              errorMessage={formTouched.preferences ? errors.liabilityPreference : undefined}
              validateOnBlur={formTouched.preferences}
              validateOnChange={formTouched.preferences}
              hint="Choose the level of liability protection you need"
            />
            <InputGroup
              id="crimeFactor"
              label="Crime Risk in Area"
              type="dropdown"
              value={formData.crimeFactor}
              onChange={(value) => setFormData({...formData, crimeFactor: value as string})}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
              hint="This helps determine theft protection needs"
            />
            <InputGroup
              id="drivingRecord"
              label="Driving Record"
              type="dropdown"
              value={formData.drivingRecord}
              onChange={(value) => setFormData({...formData, drivingRecord: value as string})}
              options={[
                { value: "clean", label: "Clean Record" },
                { value: "minor", label: "Minor Violations" },
                { value: "major", label: "Major Violations" },
              ]}
              hint="Your driving history affects your rates"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {currentStep !== "personal" && (
            <button 
              type="button"
              onClick={handleBack} 
              className="btn-secondary flex-1"
              aria-label="Go back to previous step"
            >
              Back
            </button>
          )}
          <button 
            type="submit"
            disabled={!canProceed() || loading || isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed relative"
            aria-label={currentStep === "preferences" ? "Submit form and get quotes" : "Continue to next step"}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting Quotes...
              </span>
            ) : (
              currentStep === "preferences" ? "Get My Quotes" : "Next"
            )}
          </button>
        </div>
      </form>
      
      {/* Form recovery notice */}
      <div className="text-center text-xs text-text-secondary mt-4">
        <p>Your progress is automatically saved</p>
      </div>
    </div>
  );
}
