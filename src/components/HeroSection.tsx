import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="bg-[#0f1628] text-white py-10 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
          {/* Left column - Text content */}
          <div className="space-y-4 pr-0 lg:pr-8">
            <h1 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Intelligent Solutions for
              <span className="block">Accelerated</span>
              <span className="block">Business</span>
              <span className="block">Growth</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl">
              AI-powered technologies that transform operations,
              enhance decision-making, and deliver measurable results
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 text-lg"
                role="button"
                aria-label="Book a free consultation call"
              >
                Book a Free Consultation Call
              </Link>
            </div>
          </div>

          {/* Right column - Dashboard visualizations - Reduced height and adjusted positioning */}
          <div 
            className="relative h-[400px] lg:h-[380px]"
            aria-label="Dashboard visualizations" 
            role="img"
          >
            {/* Sales Pipeline Widget - Repositioned */}
            <div className="absolute top-0 right-0 w-full max-w-md bg-gray-900/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700 shadow-xl">
              <div className="mb-2 flex justify-between items-center">
                <h2 className="text-base font-medium">Salesforce Sales Pipeline</h2>
                <div className="flex space-x-1" aria-hidden="true">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2" role="group" aria-label="Sales Pipeline Statistics">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Pipeline</div>
                  <div className="text-lg font-semibold text-green-400" aria-label="Pipeline value: 5.2 million dollars">$5.2M</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Closed</div>
                  <div className="text-lg font-semibold text-blue-400" aria-label="Closed value: 1.7 million dollars">$1.7M</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Target</div>
                  <div className="text-lg font-semibold text-purple-400" aria-label="Target value: 2.1 million dollars">$2.1M</div>
                </div>
              </div>
            </div>
            
            {/* Marketing Cloud Widget - Repositioned */}
            <div className="absolute top-28 right-4 w-4/5 max-w-sm bg-gray-900/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700 shadow-xl">
              <div className="mb-2">
                <h2 className="text-base font-medium">Marketing Cloud</h2>
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-400" aria-hidden="true"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-2" role="group" aria-label="Marketing Statistics">
                <div>
                  <div className="text-xs text-gray-400">Open Rate</div>
                  <div className="text-base font-semibold text-teal-400" aria-label="Open Rate: 43 percent">43%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Click Rate</div>
                  <div className="text-base font-semibold text-blue-400" aria-label="Click Rate: 27 percent">27%</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="w-full bg-gray-700 rounded-full h-2" role="progressbar" aria-valuenow={43} aria-valuemin={0} aria-valuemax={100}>
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '43%' }}></div>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="text-xs text-gray-400">Conversions</div>
                <div className="text-base font-semibold text-teal-400" aria-label="Conversions: 1,327">1,327</div>
              </div>
            </div>
            
            {/* Service Cloud Widget - Repositioned */}
            <div className="absolute bottom-4 right-0 w-full max-w-md bg-gray-900/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700 shadow-xl">
              <h2 className="text-base font-medium mb-2">Service Cloud</h2>
              
              <div className="grid grid-cols-4 gap-2" role="group" aria-label="Service Cloud Metrics">
                <div className="bg-gray-800 p-2 rounded text-center">
                  <div className="text-base font-semibold text-teal-400" aria-label="Average Handle Time: 1.2 hours">1.2h</div>
                  <div className="text-[10px] text-gray-400">Avg. Handle</div>
                </div>
                <div className="bg-gray-800 p-2 rounded text-center">
                  <div className="text-base font-semibold text-blue-400" aria-label="Customer Satisfaction: 95 percent">95%</div>
                  <div className="text-[10px] text-gray-400">CSAT</div>
                </div>
                <div className="bg-gray-800 p-2 rounded text-center">
                  <div className="text-base font-semibold text-green-400" aria-label="Efficiency increased by 37 percent">+37%</div>
                  <div className="text-[10px] text-gray-400">Efficiency</div>
                </div>
                <div className="bg-gray-800 p-2 rounded text-center">
                  <div className="text-base font-semibold text-red-400" aria-label="Escalations decreased by 12 percent">-12%</div>
                  <div className="text-[10px] text-gray-400">Escalations</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-2" role="group" aria-label="Service Case Status">
                <div className="bg-teal-600/70 text-center py-1 px-2 rounded text-[10px]">Solved</div>
                <div className="bg-blue-600/70 text-center py-1 px-2 rounded text-[10px]">In Progress</div>
                <div className="bg-red-600/70 text-center py-1 px-2 rounded text-[10px]">New</div>
              </div>
            </div>
            
            {/* Quota Attainment Circle - Repositioned */}
            <div className="absolute top-24 right-16 flex items-center justify-center">
              <div className="relative w-16 h-16" role="progressbar" aria-label="Quota Attainment: 92 percent" aria-valuenow={92} aria-valuemin={0} aria-valuemax={100}>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#444"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-lg font-bold text-white">92%</div>
                  <div className="text-[7px] text-gray-300">Quota Attainment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 