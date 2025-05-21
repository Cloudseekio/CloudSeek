import React from 'react';

const ExperienceCloudHeroSection: React.FC = () => {
  return (
    <section className="bg-[#0f1628] text-white py-10 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="space-y-5 pr-0 lg:pr-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Create Exceptional 
              <span className="block">Digital Experiences with</span>
              <span className="block">Experience Cloud</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl">
              Build beautiful, branded digital experiences for your customers, partners, 
              and employees without code using Salesforce's powerful platform.
            </p>
            <div className="pt-2">
              <a
                href="#consultation"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition duration-300 text-lg"
              >
                Explore Experience Cloud
              </a>
            </div>
          </div>

          {/* Right column - Experience Cloud Dashboard visualization */}
          <div className="relative h-[400px] lg:h-[380px]">
            {/* Main Dashboard Container */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl p-3 overflow-hidden">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-base font-medium">Experience Cloud Portal</h3>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              {/* Portal Navigation Bar */}
              <div className="bg-blue-900/50 rounded-t p-2 flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-xs font-bold">AC</span>
                  </div>
                  <span className="text-sm font-medium">Acme Customer Portal</span>
                </div>
                <div className="flex space-x-3 text-xs text-gray-300">
                  <span>Home</span>
                  <span>Products</span>
                  <span>Support</span>
                  <span>Community</span>
                  <span>My Account</span>
                </div>
              </div>
              
              {/* Dashboard Metrics */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Active Users</div>
                  <div className="text-lg font-semibold text-blue-400">3,842</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Engagement</div>
                  <div className="text-lg font-semibold text-green-400">78%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">Self-Service</div>
                  <div className="text-lg font-semibold text-yellow-400">64%</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-xs text-gray-400">CSAT</div>
                  <div className="text-lg font-semibold text-purple-400">4.8</div>
                </div>
              </div>
              
              {/* Portal Content Preview */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="col-span-2">
                  {/* Knowledge Base Articles */}
                  <div className="bg-gray-800 p-2 rounded h-full">
                    <h4 className="text-xs font-medium mb-2">Popular Knowledge Articles</h4>
                    <div className="space-y-2">
                      <div className="p-1.5 bg-gray-700/50 rounded flex items-center">
                        <div className="w-5 h-5 rounded bg-blue-500/40 flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-white">How to configure user permissions</p>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-[10px] text-gray-400">Views: 2,347</span>
                            <span className="text-[10px] text-green-400">Helpful: 92%</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-1.5 bg-gray-700/50 rounded flex items-center">
                        <div className="w-5 h-5 rounded bg-green-500/40 flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-white">Troubleshooting syncing issues</p>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-[10px] text-gray-400">Views: 1,985</span>
                            <span className="text-[10px] text-green-400">Helpful: 89%</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-1.5 bg-gray-700/50 rounded flex items-center">
                        <div className="w-5 h-5 rounded bg-yellow-500/40 flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-white">Upgrade guide for latest version</p>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-[10px] text-gray-400">Views: 1,542</span>
                            <span className="text-[10px] text-green-400">Helpful: 94%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Community Engagement */}
                <div className="bg-gray-800 p-2 rounded">
                  <h4 className="text-xs font-medium mb-2">Community Activity</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span>Discussion Posts</span>
                      <span className="text-blue-400">214 <span className="text-green-400 text-[8px]">↑12%</span></span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>Questions</span>
                      <span className="text-blue-400">87 <span className="text-green-400 text-[8px]">↑8%</span></span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>Comments</span>
                      <span className="text-blue-400">432 <span className="text-green-400 text-[8px]">↑18%</span></span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>Ideas</span>
                      <span className="text-blue-400">32 <span className="text-green-400 text-[8px]">↑5%</span></span>
                    </div>
                    <div className="h-10 flex items-end mt-2">
                      <div className="w-1/4 bg-blue-500/60 rounded-t h-4"></div>
                      <div className="w-1/4 bg-blue-500/60 rounded-t h-7 mx-1"></div>
                      <div className="w-1/4 bg-blue-500/60 rounded-t h-10"></div>
                      <div className="w-1/4 bg-blue-500/60 rounded-t h-3 ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Portal User Types Distribution */}
              <div>
                <h4 className="text-sm font-medium mb-2">User Segmentation</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-3/5">
                      <div className="relative h-16">
                        <svg className="w-full h-full" viewBox="0 0 100 60">
                          <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />
                          <path d="M10,50 A40,40 0 0,0 90,50" fill="none" stroke="#8b5cf6" strokeWidth="10" strokeLinecap="round" />
                          <text x="50" y="30" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">Partners</text>
                          <text x="50" y="38" fontSize="7" fill="white" textAnchor="middle">42%</text>
                          <text x="15" y="48" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">Customers</text>
                          <text x="15" y="56" fontSize="7" fill="white" textAnchor="middle">58%</text>
                        </svg>
                      </div>
                    </div>
                    <div className="w-2/5 text-[10px] space-y-1">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                        <span>Customers: 2,228</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                        <span>Partners: 1,614</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                        <span>Active Now: 142</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Portal Status */}
              <div className="absolute bottom-3 right-3 bg-blue-600/40 rounded-md px-2 py-1 flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse mr-1.5"></div>
                <span className="text-[10px] text-blue-100">Portal healthy • 99.98% uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceCloudHeroSection; 