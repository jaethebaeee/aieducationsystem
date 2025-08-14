import React from 'react';

interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className = '' }) => {
  return (
    <section className={`py-24 bg-black ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Powering College Success
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Next Generation AI powered by admissions intelligence.
          </p>
        </div>

        {/* Interactive Demo Area */}
        <div className="mb-16">
          <div className="bg-bg-card border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-medium">AI Essay Analyzer</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-text-muted text-sm">Active</span>
              </div>
            </div>

            {/* Mock Chat Interface */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-bg-secondary rounded-2xl rounded-tl-sm p-4">
                    <p className="text-white text-sm">
                      I've analyzed your essay about overcoming challenges. Your narrative shows genuine growth, but let's strengthen the connection to your intended major. Would you like specific suggestions?
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 justify-end">
                <div className="flex-1 max-w-md">
                  <div className="bg-purple-500 rounded-2xl rounded-tr-sm p-4">
                    <p className="text-white text-sm">
                      Yes, please help me connect my experience to computer science.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">You</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-bg-secondary rounded-2xl rounded-tl-sm p-4">
                    <p className="text-white text-sm">
                      Perfect! Here are 3 ways to strengthen that connection:
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        <span className="text-text-secondary text-sm">Add how problem-solving parallels debugging</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-text-secondary text-sm">Mention specific CS concepts you're excited about</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-text-secondary text-sm">Connect resilience to handling complex algorithms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast Analysis</h3>
            <p className="text-text-secondary">
              Get instant feedback on your essays with AI that processes faster than human reviewers.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">University Intelligence</h3>
            <p className="text-text-secondary">
              Leverage real admissions data to optimize your essays for specific universities.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Proven Results</h3>
            <p className="text-text-secondary">
              Join thousands of students who've improved their acceptance rates with our AI.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:-translate-y-1">
              Book a Demo →
            </button>
            <button className="px-8 py-4 border border-white/30 text-white hover:border-purple-500 hover:text-purple-500 rounded-lg font-semibold text-lg transition-all duration-200">
              Try Free →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;