import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

interface ProfileData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  
  // Step 2: Academic Info
  gpa: number;
  satScore: number;
  actScore: number;
  
  // Step 3: Extracurriculars
  extracurriculars: string[];
  achievements: string[];
  
  // Step 4: Target Colleges
  targetColleges: string[];
  
  // Step 5: Essay Goals
  essayGoals: string;
}

const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    age: 0,
    location: '',
    gpa: 0,
    satScore: 0,
    actScore: 0,
    extracurriculars: [],
    achievements: [],
    targetColleges: [],
    essayGoals: ''
  });

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic information' },
    { id: 2, title: 'Academic Info', description: 'Grades and test scores' },
    { id: 3, title: 'Activities', description: 'Extracurriculars and achievements' },
    { id: 4, title: 'Target Colleges', description: 'Your dream schools' },
    { id: 5, title: 'Essay Goals', description: 'What you want to achieve' }
  ];

  const topColleges = [
    'Harvard University',
    'Stanford University',
    'MIT',
    'Yale University',
    'Princeton University',
    'Columbia University',
    'University of Pennsylvania',
    'Dartmouth College',
    'Brown University',
    'Cornell University',
    'University of California, Berkeley',
    'University of California, Los Angeles',
    'New York University',
    'University of Michigan',
    'University of Virginia'
  ];

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile data and navigate to dashboard
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={profileData.age || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter your age"
            min="13"
            max="25"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., Seoul, South Korea"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPA (4.0 scale)
          </label>
          <input
            type="number"
            step="0.01"
            value={profileData.gpa || ''}
            onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., 3.8"
            min="0"
            max="4.0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SAT Score (Optional)
          </label>
          <input
            type="number"
            value={profileData.satScore || ''}
            onChange={(e) => handleInputChange('satScore', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., 1500"
            min="400"
            max="1600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ACT Score (Optional)
          </label>
          <input
            type="number"
            value={profileData.actScore || ''}
            onChange={(e) => handleInputChange('actScore', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., 34"
            min="1"
            max="36"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Extracurricular Activities & Achievements</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extracurricular Activities
          </label>
          <textarea
            value={profileData.extracurriculars.join('\n')}
            onChange={(e) => handleInputChange('extracurriculars', e.target.value.split('\n').filter(item => item.trim()))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={4}
            placeholder="List your extracurricular activities (one per line)&#10;e.g., Student Council President&#10;e.g., Science Olympiad Team Captain&#10;e.g., Community Service Volunteer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Major Achievements
          </label>
          <textarea
            value={profileData.achievements.join('\n')}
            onChange={(e) => handleInputChange('achievements', e.target.value.split('\n').filter(item => item.trim()))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={4}
            placeholder="List your major achievements (one per line)&#10;e.g., National Science Fair Winner&#10;e.g., Perfect SAT Score&#10;e.g., Published Research Paper"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Target Colleges</h2>
      <p className="text-gray-600">Select your dream schools to get personalized feedback</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topColleges.map((college) => (
          <label key={college} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={profileData.targetColleges.includes(college)}
              onChange={(e) => {
                if (e.target.checked) {
                  handleInputChange('targetColleges', [...profileData.targetColleges, college]);
                } else {
                  handleInputChange('targetColleges', profileData.targetColleges.filter(c => c !== college));
                }
              }}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-900">{college}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Essay Goals</h2>
      <p className="text-gray-600">Tell us what you want to achieve with your essays</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What are your main goals for your college essays?
        </label>
        <textarea
          value={profileData.essayGoals}
          onChange={(e) => handleInputChange('essayGoals', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows={6}
          placeholder="e.g., I want to showcase my leadership experience and passion for environmental science. I hope to demonstrate how my Korean heritage has shaped my perspective and how I can contribute to campus diversity. I want to show my resilience and growth through challenges I've faced."
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <OnboardingLayout currentStep={`Profile Setup - Step ${currentStep}`} completedSteps={steps.slice(0, currentStep - 1).map(s => s.title)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us provide personalized essay feedback</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step.id ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-red-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <Card padding="lg">
          {renderCurrentStep()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>Back</Button>
          <Button variant="primary" onClick={handleNext}>{currentStep === 5 ? 'Complete Setup' : 'Next'}</Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default ProfileSetupPage; 