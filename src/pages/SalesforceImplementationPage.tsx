import React from 'react';
import { ChevronRight, CheckCircle, Zap, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const SalesforceImplementationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Streamline Your Business with Salesforce Implementation
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Transform your operations with a tailored Salesforce solution that drives efficiency, customer satisfaction, and growth.
              </p>
              <Link to="/contact" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                Start Your Salesforce Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CloudSeek Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CloudSeek for Your Salesforce Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our certified experts deliver customized Salesforce solutions that align with your business goals and maximize your ROI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Certified Expertise
              </h3>
              <p className="text-gray-600">
                Our team of Salesforce-certified consultants brings years of experience across industries and use cases.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Settings size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tailored Approach
              </h3>
              <p className="text-gray-600">
                We design and configure Salesforce to match your unique business processes and objectives.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Zap size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Rapid Implementation
              </h3>
              <p className="text-gray-600">
                Our proven methodology accelerates time-to-value while maintaining quality and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative inline-block">
              Our Proven Implementation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              A structured approach that ensures successful Salesforce deployment and adoption
            </p>
          </div>

          <div className="relative">
            {/* Vertical Timeline */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-blue-700 top-0"></div>
            
            <div className="space-y-32 md:space-y-40">
              {/* Step 1: Discovery & Planning */}
              <div className="md:flex items-start">
                <div className="hidden md:block w-1/2 pr-16 text-right">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Discovery & Planning</h3>
                  <p className="text-gray-600">
                    We analyze your business processes, challenges, and goals to create a detailed implementation roadmap.
                  </p>
                </div>
                
                <div className="mx-auto md:mx-0 flex items-center justify-center relative">
                  <div className="absolute z-10 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">1</div>
                  <div className="absolute w-16 h-16 rounded-full bg-blue-200 opacity-50 animate-ping"></div>
                </div>
                
                <div className="md:w-1/2 pl-0 md:pl-16 mt-8 md:mt-0">
                  <div className="md:hidden bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Discovery & Planning</h3>
                    <p className="text-gray-600">
                      We analyze your business processes, challenges, and goals to create a detailed implementation roadmap.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Solution Design */}
              <div className="md:flex items-start">
                <div className="md:w-1/2 pr-0 md:pr-16 mb-8 md:mb-0">
                  <div className="md:hidden bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Solution Design</h3>
                    <p className="text-gray-600">
                      We architect a tailored Salesforce solution that aligns with your business requirements and industry best practices.
                    </p>
                  </div>
                </div>
                
                <div className="mx-auto md:mx-0 flex items-center justify-center relative">
                  <div className="absolute z-10 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">2</div>
                  <div className="absolute w-16 h-16 rounded-full bg-blue-200 opacity-50"></div>
                </div>
                
                <div className="hidden md:block w-1/2 pl-16 text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Solution Design</h3>
                  <p className="text-gray-600">
                    We architect a tailored Salesforce solution that aligns with your business requirements and industry best practices.
                  </p>
                </div>
              </div>

              {/* Step 3: Configuration & Development */}
              <div className="md:flex items-start">
                <div className="hidden md:block w-1/2 pr-16 text-right">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Configuration & Development</h3>
                  <p className="text-gray-600">
                    Our certified experts configure and customize Salesforce to match your specific business processes.
                  </p>
                </div>
                
                <div className="mx-auto md:mx-0 flex items-center justify-center relative">
                  <div className="absolute z-10 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
                  <div className="absolute w-16 h-16 rounded-full bg-blue-200 opacity-50"></div>
                </div>
                
                <div className="md:w-1/2 pl-0 md:pl-16 mt-8 md:mt-0">
                  <div className="md:hidden bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Configuration & Development</h3>
                    <p className="text-gray-600">
                      Our certified experts configure and customize Salesforce to match your specific business processes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: Testing & Quality Assurance */}
              <div className="md:flex items-start">
                <div className="md:w-1/2 pr-0 md:pr-16 mb-8 md:mb-0">
                  <div className="md:hidden bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Testing & Quality Assurance</h3>
                    <p className="text-gray-600">
                      We rigorously test your Salesforce implementation to ensure it meets all requirements and quality standards.
                    </p>
                  </div>
                </div>
                
                <div className="mx-auto md:mx-0 flex items-center justify-center relative">
                  <div className="absolute z-10 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">4</div>
                  <div className="absolute w-16 h-16 rounded-full bg-blue-200 opacity-50"></div>
                </div>
                
                <div className="hidden md:block w-1/2 pl-16 text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Testing & Quality Assurance</h3>
                  <p className="text-gray-600">
                    We rigorously test your Salesforce implementation to ensure it meets all requirements and quality standards.
                  </p>
                </div>
              </div>

              {/* Step 5: Training & Deployment */}
              <div className="md:flex items-start">
                <div className="hidden md:block w-1/2 pr-16 text-right">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Training & Deployment</h3>
                  <p className="text-gray-600">
                    We train your team and provide a smooth transition to your new Salesforce environment.
                  </p>
                </div>
                
                <div className="mx-auto md:mx-0 flex items-center justify-center relative">
                  <div className="absolute z-10 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">5</div>
                  <div className="absolute w-16 h-16 rounded-full bg-blue-200 opacity-50"></div>
                </div>
                
                <div className="md:w-1/2 pl-0 md:pl-16 mt-8 md:mt-0">
                  <div className="md:hidden bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Training & Deployment</h3>
                    <p className="text-gray-600">
                      We train your team and provide a smooth transition to your new Salesforce environment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 6: Ongoing Support & Optimization */}
              <div className="md:flex items-start">
                <div className="md:w-1/2 pr-0 md:pr-16 mb-8 md:mb-0">
                  <div className="md:hidden bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Ongoing Support & Optimization</h3>
                    <p className="text-gray-600">
                      We provide ongoing support and continuous improvement to ensure your Salesforce investment delivers maximum value.
                    </p>
                  </div>
                </div>
                
                <div className="mx-auto md:mx-0 flex items-center justify-center relative">
                  <div className="absolute z-10 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">6</div>
                  <div className="absolute w-16 h-16 rounded-full bg-blue-200 opacity-50"></div>
                </div>
                
                <div className="hidden md:block w-1/2 pl-16 text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Ongoing Support & Optimization</h3>
                  <p className="text-gray-600">
                    We provide ongoing support and continuous improvement to ensure your Salesforce investment delivers maximum value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits of Professional Salesforce Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience transformative business outcomes with a properly implemented Salesforce solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Increased Sales Productivity
                </h3>
                <p className="text-gray-600">
                  Streamline the sales process with automated workflows, mobile access, and 360-degree customer views that help close deals faster.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Enhanced Customer Experience
                </h3>
                <p className="text-gray-600">
                  Deliver personalized service across all channels by leveraging customer data and insights for more meaningful interactions.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Data-Driven Decision Making
                </h3>
                <p className="text-gray-600">
                  Gain real-time visibility into performance metrics and customer trends with powerful reports and dashboards.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Cross-Department Collaboration
                </h3>
                <p className="text-gray-600">
                  Break down silos with a unified platform that connects sales, service, marketing, and operations teams.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Scalable Growth Platform
                </h3>
                <p className="text-gray-600">
                  Adapt and expand your Salesforce capabilities as your business evolves, without major system overhauls.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Rapid Return on Investment
                </h3>
                <p className="text-gray-600">
                  Accelerate time-to-value with a strategically implemented solution that focuses on your highest-impact business challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Customer Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our Salesforce implementations have transformed businesses across industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Global Manufacturing Co.</h3>
                    <p className="text-gray-600">Manufacturing Industry</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "CloudSeek's Salesforce implementation has transformed our sales operations. We've reduced our sales cycle by 30% and increased our team's efficiency dramatically. The custom solution they built for distributor management has been a game-changer."
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-blue-600 font-bold text-xl">30%</span>
                    <p className="text-sm text-gray-600">Shorter Sales Cycle</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-bold text-xl">45%</span>
                    <p className="text-sm text-gray-600">More Customer Interactions</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-bold text-xl">25%</span>
                    <p className="text-sm text-gray-600">Revenue Growth</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Premier Financial Services</h3>
                    <p className="text-gray-600">Financial Services Industry</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "The CloudSeek team understood our complex compliance requirements and built a Salesforce solution that not only improved our client management but also ensured we stay compliant with industry regulations. We've seen tremendous improvements in our client onboarding process."
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-blue-600 font-bold text-xl">70%</span>
                    <p className="text-sm text-gray-600">Faster Onboarding</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-bold text-xl">100%</span>
                    <p className="text-sm text-gray-600">Compliance Rate</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-bold text-xl">35%</span>
                    <p className="text-sm text-gray-600">Higher Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">MedCare Solutions</h3>
                    <p className="text-gray-600">Healthcare Industry</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "Our Salesforce implementation with CloudSeek has revolutionized our patient management and referral tracking. We've seen a 50% improvement in patient satisfaction scores and significantly reduced administrative time for our staff."
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-blue-600 font-bold text-xl">50%</span>
                    <p className="text-sm text-gray-600">Patient Satisfaction</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-bold text-xl">65%</span>
                    <p className="text-sm text-gray-600">Faster Referrals</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-bold text-xl">30%</span>
                    <p className="text-sm text-gray-600">Admin Time Savings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/contact" className="inline-flex items-center text-blue-600 font-medium">
              View more success stories
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Certified Salesforce Expertise You Can Trust
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our team of certified Salesforce consultants, architects, and developers bring deep expertise across the entire Salesforce ecosystem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <img src="/images/sf-admin-badge.png.png" alt="Admin Badge" className="h-32 w-auto drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-6">Certified Administrators</h3>
              <p className="text-gray-600">25+ Certifications</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <img src="/images/sf-developer-badge.png.png" alt="Developer Badge" className="h-32 w-auto drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-6">Certified Developers</h3>
              <p className="text-gray-600">20+ Certifications</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <img src="/images/sf-consultant-badge.png.png" alt="Consultant Badge" className="h-32 w-auto drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-6">Certified Consultants</h3>
              <p className="text-gray-600">15+ Certifications</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <img src="/images/sf-architect-badge.png.png" alt="Architect Badge" className="h-32 w-auto drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-6">Certified Architects</h3>
              <p className="text-gray-600">10+ Certifications</p>
            </div>
          </div>
          
          <div className="mt-16 md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Approach
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                We combine technical expertise with industry knowledge to deliver Salesforce solutions that solve real business challenges and drive measurable results.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Business-first implementation strategy</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Focus on user adoption and change management</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Continuous optimization for maximum ROI</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Packages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Salesforce Implementation Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select from our flexible implementation options designed to meet your specific business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Essentials</h3>
                <p className="text-gray-600">For small businesses & startups</p>
                <div className="mt-4 text-blue-600 text-3xl font-bold">Starting at $15,000</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Core Sales Cloud configuration</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Basic workflow automation</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Data migration from 1-2 sources</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Standard reports & dashboards</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Admin & user training</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">30 days post-launch support</p>
                </li>
              </ul>
              
              <Link to="/contact" className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Request Quote
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-600 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600">For growing mid-sized companies</p>
                <div className="mt-4 text-blue-600 text-3xl font-bold">Starting at $35,000</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Sales & Service Cloud configuration</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Advanced process automation</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Data migration from multiple sources</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Custom objects & fields</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Advanced reports & dashboards</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Integration with key systems</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Comprehensive user training</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">90 days post-launch support</p>
                </li>
              </ul>
              
              <Link to="/contact" className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Request Quote
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600">For large complex organizations</p>
                <div className="mt-4 text-blue-600 text-3xl font-bold">Custom Pricing</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Multi-cloud implementation</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Complex business process automation</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Enterprise data migration strategy</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Custom application development</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Advanced integrations</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Global rollout support</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Executive dashboards & reporting</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={18} />
                  </div>
                  <p className="ml-3 text-gray-600">Dedicated support & maintenance</p>
                </li>
              </ul>
              
              <Link to="/contact" className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to revolutionize your sales process?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Let our experts guide you through the transformation. Discover how Sales Cloud can be tailored 
            to your specific business needs and drive measurable results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors text-lg font-medium">
              Schedule a Demo
            </Link>
            <Link to="/contact" className="inline-block bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesforceImplementationPage; 