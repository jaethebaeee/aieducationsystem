import React, { useState } from 'react';
import axios from 'axios';

interface AnalysisResult {
  // define minimal shape used by component
  [key: string]: any;
}

const GrammarChecker: React.FC<{ onAnalysisComplete?: (r: AnalysisResult) => void }>= ({ onAnalysisComplete }) => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  // service availability is inferred from API response when needed
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setError(null);
    try {
      const response = await axios.post('/api/grammar/analyze', { text });
      const data = response.data as { success?: boolean; data?: AnalysisResult; service_available?: boolean };
      if (data?.success) {
        const result = data.data ?? {};
        setAnalysis(result);
        onAnalysisComplete?.(result);
      } else {
        setError('Failed to analyze text');
      }
    } catch (e) {
      setError('Service unavailable');
    }
  };

  return (
    <div>
      {/* simplified for stub */}
      <textarea value={text} onChange={(e)=>setText(e.target.value)} />
      <button onClick={analyze}>Analyze</button>
      {error && <p>{error}</p>}
      {analysis && <pre>{JSON.stringify(analysis, null, 2)}</pre>}
    </div>
  );
};

export default GrammarChecker; 