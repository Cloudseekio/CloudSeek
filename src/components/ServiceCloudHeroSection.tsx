import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCloudHeroSection: React.FC = () => {
  return (
    <section className="bg-[#0f1628] text-white py-10 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="space-y-5 pr-0 lg:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Deliver Exceptional 
              <span className="block">Customer Service with</span>
              <span className="block">Service Cloud</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl">
              Transform how your team supports customers across every touchpoint 
              with AI-powered service solutions.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition duration-300 text-lg"
              >
                Request a Consultation
              </Link>
            </div>
          </div>

          {/* Right column - Service Cloud Dashboard visualization */}
          <div className="relative h-[400px] lg:h-[380px]">
            {/* Main Dashboard Container */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl p-3 overflow-hidden">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-base font-medium">Service Cloud Dashboard</h3>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              {/* Service KPIs */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Avg. Handle</div>
                  <div className="text-lg font-semibold text-blue-400">1.2h</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">CSAT</div>
                  <div className="text-lg font-semibold text-green-400">95%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Efficiency</div>
                  <div className="text-lg font-semibold text-green-400">+37%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Escalations</div>
                  <div className="text-lg font-semibold text-red-400">-12%</div>
                </div>
              </div>
              
              {/* Case Status Cards */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-teal-600/30 p-2 rounded text-center">
                  <div className="text-sm text-white">Solved</div>
                  <div className="text-2xl font-semibold text-white mt-1">126</div>
                  <div className="text-xs text-teal-300 mt-1">↑ 18% vs last week</div>
                </div>
                <div className="bg-blue-600/30 p-2 rounded text-center">
                  <div className="text-sm text-white">In Progress</div>
                  <div className="text-2xl font-semibold text-white mt-1">85</div>
                  <div className="text-xs text-blue-300 mt-1">↓ 7% vs last week</div>
                </div>
                <div className="bg-red-600/30 p-2 rounded text-center">
                  <div className="text-sm text-white">New</div>
                  <div className="text-2xl font-semibold text-white mt-1">42</div>
                  <div className="text-xs text-red-300 mt-1">↓ 12% vs last week</div>
                </div>
              </div>
              
              {/* Response Time by Channel */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Response Time by Channel</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Chat</span>
                        <span className="text-green-400">1.2 min</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Social</span>
                        <span className="text-blue-400">8.5 min</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Email</span>
                        <span className="text-yellow-400">24 min</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Phone</span>
                        <span className="text-purple-400">1.8 min</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Customer Satisfaction Trend - Made more compact */}
              <div>
                <h4 className="text-sm font-medium mb-2">Customer Satisfaction Trend</h4>
                <div className="bg-gray-800 p-2 rounded h-20 relative">
                  {/* CSAT Trend Line Chart */}
                  <svg className="w-full h-full" viewBox="0 0 300 60">
                    <path
                      d="M0,45 L20,42 L40,43 L60,38 L80,36 L100,32 L120,26 L140,28 L160,24 L180,22 L200,19 L220,16 L240,17 L260,14 L280,12 L300,8"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2"
                    />
                    <circle cx="300" cy="8" r="3" fill="#4ade80" />
                    <text x="280" y="7" fontSize="8" fill="white">95%</text>
                  </svg>
                  
                  {/* Month labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] text-gray-400">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
              </div>
              
              {/* Live Agent Status */}
              <div className="absolute bottom-3 right-3 bg-green-600/40 rounded-md px-2 py-1 flex items-center">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse mr-1.5"></div>
                <span className="text-[10px] text-green-100">14 Agents Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCloudHeroSection; 