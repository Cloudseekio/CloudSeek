import React from 'react';
import { Link } from 'react-router-dom';

const SalesCloudHeroSection: React.FC = () => {
  return (
    <section className="bg-[#0f1628] text-white py-10 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="space-y-5 pr-0 lg:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Transform Your Sales 
              <span className="block">Process with Salesforce</span>
              <span className="block">Sales Cloud</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl">
              Streamline your sales operations, boost rep productivity, and close more deals 
              with the world's #1 sales platform.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition duration-300 text-lg"
              >
                Get Started with Sales Cloud
              </Link>
            </div>
          </div>

          {/* Right column - Sales Cloud Dashboard visualization */}
          <div className="relative h-[400px] lg:h-[380px]">
            {/* Main Dashboard Container */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl p-3 overflow-hidden">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-base font-medium">Sales Cloud Dashboard</h3>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              {/* Sales Performance Overview */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Current Quarter</div>
                  <div className="text-lg font-semibold text-blue-400">$3.2M</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">% to Target</div>
                  <div className="text-lg font-semibold text-green-400">78%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Win Rate</div>
                  <div className="text-lg font-semibold text-yellow-400">32%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Avg Deal Size</div>
                  <div className="text-lg font-semibold text-purple-400">$28.5K</div>
                </div>
              </div>
              
              {/* Pipeline Stage Breakdown */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Pipeline by Stage</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Qualification</span>
                        <span className="text-blue-400">$1.8M</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Proposal</span>
                        <span className="text-green-400">$1.2M</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Negotiation</span>
                        <span className="text-yellow-400">$0.8M</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Closing</span>
                        <span className="text-red-400">$0.4M</span>
                      </div>
                      <div className="h-2 w-full bg-gray-700 rounded-full">
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sales Rep Performance */}
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Top Performing Reps</h4>
                <div className="bg-gray-800 rounded overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="py-1 px-2 text-left text-gray-300">Rep</th>
                        <th className="py-1 px-2 text-right text-gray-300">Closed</th>
                        <th className="py-1 px-2 text-right text-gray-300">Pipeline</th>
                        <th className="py-1 px-2 text-right text-gray-300">Activities</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="py-1 px-2 text-white">Sarah K.</td>
                        <td className="py-1 px-2 text-right text-green-400">$482K</td>
                        <td className="py-1 px-2 text-right text-blue-400">$1.2M</td>
                        <td className="py-1 px-2 text-right text-yellow-400">87</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-1 px-2 text-white">Mike T.</td>
                        <td className="py-1 px-2 text-right text-green-400">$375K</td>
                        <td className="py-1 px-2 text-right text-blue-400">$985K</td>
                        <td className="py-1 px-2 text-right text-yellow-400">72</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2 text-white">David L.</td>
                        <td className="py-1 px-2 text-right text-green-400">$320K</td>
                        <td className="py-1 px-2 text-right text-blue-400">$745K</td>
                        <td className="py-1 px-2 text-right text-yellow-400">64</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Sales Activity Tracker */}
              <div>
                <h4 className="text-sm font-medium mb-2">Sales Activities This Week</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-gray-800 p-2 rounded text-center">
                    <div className="text-base font-semibold text-blue-400">127</div>
                    <div className="text-[10px] text-gray-400">Calls</div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded text-center">
                    <div className="text-base font-semibold text-green-400">84</div>
                    <div className="text-[10px] text-gray-400">Meetings</div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded text-center">
                    <div className="text-base font-semibold text-yellow-400">356</div>
                    <div className="text-[10px] text-gray-400">Emails</div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded text-center">
                    <div className="text-base font-semibold text-purple-400">42</div>
                    <div className="text-[10px] text-gray-400">Proposals</div>
                  </div>
                </div>
              </div>
              
              {/* Live Update Notification */}
              <div className="absolute bottom-3 right-3 bg-blue-600/40 rounded-md px-3 py-1.5 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-[10px] text-blue-100">Live Dashboard • Updated 2m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesCloudHeroSection; 