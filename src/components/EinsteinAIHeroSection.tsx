import React from 'react';

const EinsteinAIHeroSection: React.FC = () => {
  return (
    <section className="bg-[#0f1628] text-white py-10 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="space-y-5 pr-0 lg:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Transform Your Business 
              <span className="block">with Einstein AI</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl">
              Harness the power of artificial intelligence to drive smarter decisions, 
              automate processes, and deliver personalized experiences at scale.
            </p>
            <div className="pt-2">
              <a
                href="#consultation"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition duration-300 text-lg"
              >
                Explore Einstein AI
              </a>
            </div>
          </div>

          {/* Right column - Einstein AI Dashboard visualization */}
          <div className="relative h-[400px] lg:h-[380px]">
            {/* Main Dashboard Container */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl p-3 overflow-hidden">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-base font-medium">Einstein AI Analytics Dashboard</h3>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              {/* AI Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Prediction Accuracy</div>
                  <div className="text-lg font-semibold text-purple-400">94.3%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Insights Generated</div>
                  <div className="text-lg font-semibold text-blue-400">1,249</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Time Saved</div>
                  <div className="text-lg font-semibold text-green-400">267 hrs</div>
                </div>
              </div>
              
              {/* AI Prediction Visualization */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Sales Opportunity Predictions</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-white">Opportunity Win Probability</span>
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">AI Confidence: High</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Acme Corp - Enterprise License</span>
                        <span className="text-green-400">78%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>TechGiant - Platform Integration</span>
                        <span className="text-yellow-400">52%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Global Services - Consulting Package</span>
                        <span className="text-red-400">31%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '31%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* NLP Sentiment Analysis */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Customer Sentiment Analysis</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-1">
                      <div className="text-green-400 text-lg font-bold">68%</div>
                      <div className="text-[10px] text-gray-400">Positive</div>
                      <div className="mt-1 h-16 w-full bg-green-500/20 rounded-sm flex items-end justify-center">
                        <div className="w-full bg-green-500 h-[68%]"></div>
                      </div>
                    </div>
                    <div className="text-center p-1">
                      <div className="text-gray-400 text-lg font-bold">22%</div>
                      <div className="text-[10px] text-gray-400">Neutral</div>
                      <div className="mt-1 h-16 w-full bg-gray-500/20 rounded-sm flex items-end justify-center">
                        <div className="w-full bg-gray-500 h-[22%]"></div>
                      </div>
                    </div>
                    <div className="text-center p-1">
                      <div className="text-red-400 text-lg font-bold">10%</div>
                      <div className="text-[10px] text-gray-400">Negative</div>
                      <div className="mt-1 h-16 w-full bg-red-500/20 rounded-sm flex items-end justify-center">
                        <div className="w-full bg-red-500 h-[10%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Recommendations */}
              <div>
                <h4 className="text-sm font-medium mb-2">AI-Generated Recommendations</h4>
                <div className="bg-gray-800 rounded p-2">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] text-white font-bold">AI</span>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-white">Increase follow-up email frequency for TechGiant opportunity to improve win rate by ~12%</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] text-white font-bold">AI</span>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-white">Customer service team should address negative sentiment around mobile app navigation issues</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] text-white font-bold">AI</span>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-white">Automate lead scoring for manufacturing segment to improve qualification efficiency</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Processing Animation */}
              <div className="absolute bottom-3 right-3 bg-gray-800/80 rounded-full p-2 h-12 w-12 flex items-center justify-center">
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 border-2 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-1 border-2 border-transparent border-l-blue-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-2 border-2 border-transparent border-b-green-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
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

export default EinsteinAIHeroSection; 