import React from 'react';

const PardotHeroSection: React.FC = () => {
  return (
    <section className="bg-[#0f1628] text-white py-10 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="space-y-5 pr-0 lg:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Accelerate B2B Marketing 
              <span className="block">Results with Pardot</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl">
              Drive pipeline growth and close more deals with Salesforce's
              powerful B2B marketing automation platform.
            </p>
            <div className="pt-2">
              <a
                href="#consultation"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition duration-300 text-lg"
              >
                Discover Pardot
              </a>
            </div>
          </div>

          {/* Right column - Pardot Dashboard visualization */}
          <div className="relative h-[400px] lg:h-[380px]">
            {/* Main Dashboard Container */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl p-3 overflow-hidden">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-base font-medium">Pardot Marketing Dashboard</h3>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              {/* Email Campaign Performance */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Total Sent</div>
                  <div className="text-lg font-semibold text-blue-400">24,867</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Open Rate</div>
                  <div className="text-lg font-semibold text-green-400">28.5%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Click Rate</div>
                  <div className="text-lg font-semibold text-yellow-400">12.3%</div>
                </div>
              </div>
              
              {/* Lead Generation Overview */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Lead Generation Overview</h4>
                <div className="bg-gray-800 p-2 rounded mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-400">New Leads</span>
                    <span className="text-xs text-green-400">+15.8%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-white">763</span>
                    <span className="text-xs text-gray-400">Goal: 1,000</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-2 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-400">MQLs</span>
                    <span className="text-xs text-green-400">+8.2%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '52%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-white">312</span>
                    <span className="text-xs text-gray-400">Goal: 600</span>
                  </div>
                </div>
              </div>
              
              {/* Campaign Performance */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Top Performing Campaigns</h4>
                <div className="bg-gray-800 rounded overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="py-1 px-2 text-left text-gray-300">Campaign</th>
                        <th className="py-1 px-2 text-right text-gray-300">Engagement</th>
                        <th className="py-1 px-2 text-right text-gray-300">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="py-1 px-2 text-white">Q1 Product Launch</td>
                        <td className="py-1 px-2 text-right text-blue-400">86%</td>
                        <td className="py-1 px-2 text-right text-green-400">23%</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-1 px-2 text-white">Webinar Series</td>
                        <td className="py-1 px-2 text-right text-blue-400">72%</td>
                        <td className="py-1 px-2 text-right text-green-400">18%</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 text-white">Industry Report</td>
                        <td className="py-1 px-2 text-right text-blue-400">64%</td>
                        <td className="py-1 px-2 text-right text-green-400">15%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Lead Scoring Distribution */}
              <div>
                <h4 className="text-sm font-medium mb-2">Lead Scoring Distribution</h4>
                <div className="flex items-center space-x-1">
                  <div className="h-4 bg-red-500 rounded-l" style={{ width: '15%' }}></div>
                  <div className="h-4 bg-orange-500" style={{ width: '25%' }}></div>
                  <div className="h-4 bg-yellow-500" style={{ width: '30%' }}></div>
                  <div className="h-4 bg-green-500" style={{ width: '20%' }}></div>
                  <div className="h-4 bg-emerald-500 rounded-r" style={{ width: '10%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                  <span>Cold (15%)</span>
                  <span>Warm (25%)</span>
                  <span>Hot (30%)</span>
                  <span>Ready (20%)</span>
                  <span>Customer (10%)</span>
                </div>
              </div>
              
              {/* Real-time Activity Feed */}
              <div className="absolute bottom-3 right-3 bg-gray-800 rounded p-2 w-1/3">
                <h4 className="text-[10px] font-medium mb-1 text-gray-300">REAL-TIME ACTIVITY</h4>
                <div className="space-y-1 max-h-16 overflow-hidden">
                  <div className="flex items-center text-[10px]">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-gray-300">Form submission: Product Demo</span>
                  </div>
                  <div className="flex items-center text-[10px]">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-1"></div>
                    <span className="text-gray-300">Email opened: "Q2 Updates"</span>
                  </div>
                  <div className="flex items-center text-[10px]">
                    <div className="w-1 h-1 bg-yellow-500 rounded-full mr-1"></div>
                    <span className="text-gray-300">Landing page visit: /enterprise</span>
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

export default PardotHeroSection; 