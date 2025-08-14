import React, { useState } from 'react';
import GrammarChecker from '../components/common/GrammarChecker';
import PrivateSEO from '../components/seo/PrivateSEO';

const GrammarTestPage: React.FC = () => {
  const [essayText, setEssayText] = useState(`I am Korean student who want to study in America. My dream is become engineer and help my family. I like to study very much and I am good student.`);

  return (
    <div className="min-h-screen bg-black py-14">
      <PrivateSEO title="Grammar Checker Test | AdmitAI Korea" language="en" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Grammar Checker Test
          </h1>
          <p className="text-text-secondary text-base">
            Test the LanguageTool integration for Korean students' essays
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Essay Input (for preview only) */}
          <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_-35px_rgba(99,102,241,0.25)]">
            <h2 className="text-xl font-semibold text-white mb-4">Essay Text (Preview)</h2>
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              className="w-full h-64 p-4 bg-[#0b0b0e] border border-white/10 rounded-xl text-white placeholder-white/40 resize-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none"
              placeholder="Enter your essay text here..."
            />
            <div className="mt-4 text-sm text-text-muted">
              Word count: {essayText.split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </div>

          {/* Grammar Analysis */}
          <div className="bg-[#0d0d10] border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_-35px_rgba(99,102,241,0.25)]">
            <h2 className="text-xl font-semibold text-white mb-4">Grammar Analysis</h2>
            <GrammarChecker 
              onAnalysisComplete={(analysis) => {
                console.log('Grammar analysis complete:', analysis);
              }}
            />
          </div>
        </div>

        {/* Sample Essays */}
        <div className="mt-10 bg-[#0d0d10] border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-5">Sample Essays for Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setEssayText(`I am Korean student who want to study in America. My dream is become engineer and help my family. I like to study very much and I am good student.`)}
              className="p-4 border border-white/10 rounded-xl hover:bg-white/5 text-left text-white transition-colors"
            >
              <h3 className="font-medium mb-2">Sample 1: Basic ESL Errors</h3>
              <p className="text-sm text-text-secondary">Contains missing articles and basic grammar issues</p>
            </button>
            
            <button
              onClick={() => setEssayText(`I am a Korean student who wants to study in America. My dream is to become an engineer and help my family. I like to study very much, and I am a good student.`)}
              className="p-4 border border-white/10 rounded-xl hover:bg-white/5 text-left text-white transition-colors"
            >
              <h3 className="font-medium mb-2">Sample 2: Corrected Version</h3>
              <p className="text-sm text-text-secondary">Same content with grammar corrections</p>
            </button>
            
            <button
              onClick={() => setEssayText(`My journey from Korea to America has been filled with challenges and opportunities. Growing up in Seoul, I was always fascinated by technology and innovation. When I first visited the United States, I was amazed by the diversity and creativity I encountered. This experience inspired me to pursue my education in America, where I believe I can develop the skills needed to make a meaningful contribution to society.`)}
              className="p-4 border border-white/10 rounded-xl hover:bg-white/5 text-left text-white transition-colors"
            >
              <h3 className="font-medium mb-2">Sample 3: Well-Written Essay</h3>
              <p className="text-sm text-text-secondary">A more sophisticated essay with good grammar</p>
            </button>
            
            <button
              onClick={() => setEssayText(`I am very good student from Korea. I study hard everyday and get good grades. My parents are proud of me because I work hard. I want go to university in America because it have best education. I think I will be successful student there.`)}
              className="p-4 border border-white/10 rounded-xl hover:bg-white/5 text-left text-white transition-colors"
            >
              <h3 className="font-medium mb-2">Sample 4: Multiple ESL Issues</h3>
              <p className="text-sm text-text-secondary">Contains various ESL patterns and errors</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarTestPage; 