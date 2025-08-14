import React from 'react';

interface ProductSectionsProps {
  className?: string;
}

const ProductSections: React.FC<ProductSectionsProps> = ({ className = '' }) => {
  return (
    <section className={`py-24 bg-black ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            AI Solutions
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Transform your college application process with AI-powered solutions 
            that continuously improve with real admissions data.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* For Students Card */}
          <div className="bg-bg-card border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group">
            <div className="mb-6">
              <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase">
                FOR STUDENTS
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                AI Essay Intelligence
              </h3>
              <p className="text-text-secondary text-lg">
                Transform your essays with AI-powered feedback and university-specific optimization.
              </p>
            </div>

            {/* Mock Interface */}
            <div className="bg-bg-secondary rounded-xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-text-muted text-xs">Essay Editor</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-purple-400 text-sm font-medium">Strength Identified</p>
                      <p className="text-text-secondary text-xs">
                        Your personal story shows authentic leadership growth.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-orange-400 text-sm font-medium">University Match</p>
                      <p className="text-text-secondary text-xs">
                        This essay aligns with Stanford's innovation values.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-blue-400 text-sm font-medium">Improvement Suggestion</p>
                      <p className="text-text-secondary text-xs">
                        Consider adding specific metrics to strengthen impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Institutions Card */}
          <div className="bg-bg-card border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group">
            <div className="mb-6">
              <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
                FOR INSTITUTIONS
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                Admissions Analytics Platform
              </h3>
              <p className="text-text-secondary text-lg">
                Streamline application review with AI-powered student evaluation and matching.
              </p>
            </div>

            {/* Mock Dashboard */}
            <div className="bg-bg-secondary rounded-xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-sm font-medium">Application Dashboard</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-text-muted text-xs">Live</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-500/10 rounded-lg p-3 text-center">
                    <div className="text-purple-400 text-lg font-bold">1,247</div>
                    <div className="text-text-muted text-xs">Applications</div>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-3 text-center">
                    <div className="text-green-400 text-lg font-bold">89%</div>
                    <div className="text-text-muted text-xs">Match Rate</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                    <div className="text-blue-400 text-lg font-bold">24h</div>
                    <div className="text-text-muted text-xs">Avg Review</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <span className="text-white text-sm">High-match candidates</span>
                    <span className="text-green-400 text-sm font-medium">+12%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <span className="text-white text-sm">Essay quality scores</span>
                    <span className="text-blue-400 text-sm font-medium">8.7/10</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <span className="text-white text-sm">Processing time</span>
                    <span className="text-purple-400 text-sm font-medium">-45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSections;