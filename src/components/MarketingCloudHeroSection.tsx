import React from 'react';
import { Link } from 'react-router-dom';

const MarketingCloudHeroSection: React.FC = () => {
  return (
    <section className="bg-[#0f1628] text-white py-10 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="space-y-5 pr-0 lg:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Personalize Every 
              <span className="block">Customer Journey with</span>
              <span className="block">Marketing Cloud</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl">
              Create seamless, personalized experiences across email, mobile, social, 
              and web with Salesforce's unified marketing platform.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition duration-300 text-lg"
              >
                Explore Marketing Cloud
              </Link>
            </div>
          </div>

          {/* Right column - Marketing Cloud Dashboard visualization */}
          <div className="relative h-[400px] lg:h-[380px]">
            {/* Main Dashboard Container */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl p-3 overflow-hidden">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-base font-medium">Marketing Cloud Dashboard</h3>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              {/* Email Campaign Performance */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Open Rate</div>
                  <div className="text-lg font-semibold text-blue-400">27.3%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Click Rate</div>
                  <div className="text-lg font-semibold text-green-400">4.8%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Conversion</div>
                  <div className="text-lg font-semibold text-purple-400">3.2%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">ROI</div>
                  <div className="text-lg font-semibold text-yellow-400">412%</div>
                </div>
              </div>
              
              {/* Active Journeys */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Active Customer Journeys</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-600/30 p-2 rounded">
                    <div className="flex justify-between">
                      <span className="text-sm">Welcome Series</span>
                      <span className="text-xs bg-blue-500/50 px-1.5 rounded">Active</span>
                    </div>
                    <div className="mt-1.5 text-xs text-gray-300">
                      <div className="flex justify-between mb-1">
                        <span>Contacts</span>
                        <span>2,482</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-700 rounded-full">
                        <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-600/30 p-2 rounded">
                    <div className="flex justify-between">
                      <span className="text-sm">Re-engagement</span>
                      <span className="text-xs bg-purple-500/50 px-1.5 rounded">Active</span>
                    </div>
                    <div className="mt-1.5 text-xs text-gray-300">
                      <div className="flex justify-between mb-1">
                        <span>Contacts</span>
                        <span>1,874</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-700 rounded-full">
                        <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Audience Segmentation */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Audience Segmentation</h4>
                <div className="bg-gray-800 rounded p-2">
                  <div className="relative h-28">
                    {/* Segmentation Visualization */}
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                      {/* Segment circles */}
                      <circle cx="55" cy="50" r="36" fill="#3b82f6" opacity="0.6" />
                      <circle cx="95" cy="50" r="24" fill="#a855f7" opacity="0.6" />
                      <circle cx="145" cy="50" r="32" fill="#10b981" opacity="0.6" />
                      
                      {/* Labels */}
                      <text x="55" y="50" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">High-Value</text>
                      <text x="55" y="60" textAnchor="middle" fontSize="7" fill="white">32%</text>
                      
                      <text x="95" y="50" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">New</text>
                      <text x="95" y="60" textAnchor="middle" fontSize="7" fill="white">18%</text>
                      
                      <text x="145" y="50" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">Engaged</text>
                      <text x="145" y="60" textAnchor="middle" fontSize="7" fill="white">28%</text>
                      
                      {/* Intersection labels */}
                      <text x="75" y="40" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">12%</text>
                      <text x="120" y="44" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">9%</text>
                    </svg>
                    <div className="absolute top-1 right-1 text-[9px] text-gray-400">Total Audience: 184,352</div>
                  </div>
                </div>
              </div>
              
              {/* Channel Performance */}
              <div>
                <h4 className="text-sm font-medium mb-2">Channel Engagement</h4>
                <div className="bg-gray-800 rounded p-2">
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Email</span>
                        <span className="text-blue-400">3.8M sends</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Mobile</span>
                        <span className="text-purple-400">2.2M sends</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Social</span>
                        <span className="text-teal-400">1.7M impressions</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-teal-500 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Web</span>
                        <span className="text-orange-400">2.9M interactions</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-orange-500 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Insights */}
              <div className="absolute bottom-3 right-3 bg-teal-600/40 rounded-md px-2 py-1 flex items-center">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse mr-1.5"></div>
                <span className="text-[10px] text-teal-100">Einstein AI: 3 optimization suggestions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingCloudHeroSection; 