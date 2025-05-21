import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, LineChart, BarChart2, ArrowRight, Users, Zap, Clock, Award } from 'lucide-react';

const CoastalDevelopments: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "Coastal Developments",
    subtitle: "Sales & Marketing Transformation",
    industry: "Real Estate",
    challenge: "Coastal Developments, a residential property developer specializing in sustainable coastal communities, struggled to track leads across multiple development projects and lacked visibility into their marketing ROI. Their rapidly expanding portfolio of properties made it increasingly difficult to manage the sales pipeline, resulting in lost opportunities and inefficient marketing spend allocation.",
    solution: "We implemented Salesforce Sales Cloud with Pardot integration, custom project tracking, and comprehensive marketing attribution. The solution included:",
    solutionPoints: [
      "Custom development lifecycle tracking from lead to closing",
      "Multi-touch attribution model to measure marketing channel effectiveness",
      "Automated lead scoring and routing based on project interest and budget",
      "Interactive dashboards for real-time visibility into project performance",
      "Campaign ROI calculator with detailed spend tracking and conversion metrics"
    ],
    results: [
      "215% increase in qualified leads",
      "42% improvement in marketing ROI",
      "23% higher closing rate on new developments",
      "Real-time visibility across all projects",
      "68% reduction in lead response time"
    ],
    implementation: "The implementation was completed in a phased approach over 3 months, allowing the sales team to continue operations while transitioning to the new system. We provided customized training for marketing, sales, and executive teams to ensure adoption across all departments.",
    technology: ["Salesforce Sales Cloud", "Pardot", "Einstein Analytics", "Custom Dashboards", "Campaign Attribution", "Mobile Sales App"],
    clientInfo: {
      name: "Coastal Developments",
      location: "Based in Florida with developments along the Eastern Seaboard",
      size: "120+ employees across sales, marketing, and development",
      founded: "2008",
      focus: "Sustainable residential property development in coastal communities"
    },
    testimonial: {
      quote: "CloudSeek helped us implement a solution that finally gives us clear insight into our marketing performance and streamlines our sales process from lead to closing. The impact on our business has been remarkable. We can now make data-driven decisions about where to allocate our marketing budget and which development projects to prioritize.",
      author: "Sarah Martinez",
      position: "Marketing Director, Coastal Developments",
      avatar: "/images/avatars/sarah-martinez.jpg"
    },
    keyMetrics: [
      { label: "Increase in Qualified Leads", value: "215%" },
      { label: "Marketing ROI Improvement", value: "42%" },
      { label: "Higher Closing Rate", value: "23%" },
      { label: "Reduction in Lead Response Time", value: "68%" }
    ],
    heroImage: "/images/case-studies/coastal-developments-hero.jpg",
    galleryImages: [
      { src: "/images/case-studies/coastal-dashboard.jpg", alt: "Marketing Attribution Dashboard", caption: "Multi-touch attribution dashboard" },
      { src: "/images/case-studies/coastal-campaign.jpg", alt: "Campaign ROI Tracking", caption: "Campaign ROI tracking interface" },
      { src: "/images/case-studies/coastal-lead-scoring.jpg", alt: "Lead Scoring System", caption: "Automated lead scoring system" }
    ],
    relatedCaseStudies: [
      { title: "Luxe Properties Group: 37% Increase in Lead Conversion", slug: "luxe-properties-lead-conversion" },
      { title: "Metro Property Management: Tenant Experience & Operations Optimization", slug: "metro-property-tenant-experience" }
    ]
  };

  // Performance metrics for progress bars
  const performanceMetrics = {
    socialMedia: "w-[86%]",
    emailCampaigns: "w-[78%]",
    propertyPortals: "w-[64%]",
    searchAds: "w-[59%]",
    traditionalMedia: "w-[32%]"
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-4">
              <Link to="/case-studies" className="inline-flex items-center text-blue-300 hover:text-blue-100">
                <ChevronLeft size={16} className="mr-1" />
                Back to Case Studies
              </Link>
            </div>
            <div className="md:w-2/3">
              <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-md mb-4 inline-block">
                Real Estate
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Coastal Developments
              </h1>
              <p className="text-2xl text-blue-100 mb-8">
                Sales & Marketing Transformation
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
                  <p className="text-blue-300 text-sm">Increase in Qualified Leads</p>
                  <p className="text-3xl font-bold text-white">215%</p>
                </div>
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
                  <p className="text-blue-300 text-sm">Marketing ROI Improvement</p>
                  <p className="text-3xl font-bold text-white">42%</p>
                </div>
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
                  <p className="text-blue-300 text-sm">Higher Closing Rate</p>
                  <p className="text-3xl font-bold text-white">23%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-xl shadow-md mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenge</h2>
              <p className="text-gray-700 mb-6">
                Coastal Developments, a residential property developer, struggled to track leads across 
                multiple development projects and lacked visibility into their marketing ROI.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Solution</h2>
              <p className="text-gray-700 mb-4">
                We implemented Salesforce Sales Cloud with Pardot integration, custom project tracking, 
                and comprehensive marketing attribution.
              </p>
              <ul className="list-disc pl-6 mb-8 text-gray-700">
                <li className="mb-2">Multi-touch attribution model</li>
                <li className="mb-2">Automated lead scoring and routing</li>
                <li className="mb-2">Interactive performance dashboards</li>
                <li className="mb-2">Campaign ROI calculator</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  "215% increase in qualified leads",
                  "42% improvement in marketing ROI",
                  "23% higher closing rate on new developments",
                  "Real-time visibility across all projects"
                ].map((result, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <p className="text-gray-700">{result}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
                <p className="italic text-gray-700 mb-4">
                  "CloudSeek helped us implement a solution that finally gives us clear insight into our marketing 
                  performance and streamlines our sales process from lead to closing."
                </p>
                <p className="font-medium text-gray-900">Sarah Martinez, Marketing Director</p>
              </div>
            </div>
            
            {/* Marketing Performance */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Marketing Channel Performance</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Social Media</span>
                    <span className="text-blue-600 font-medium">86%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.socialMedia}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Email Campaigns</span>
                    <span className="text-blue-600 font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.emailCampaigns}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Property Portals</span>
                    <span className="text-blue-600 font-medium">64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.propertyPortals}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Search Ads</span>
                    <span className="text-blue-600 font-medium">59%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.searchAds}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Traditional Media</span>
                    <span className="text-blue-600 font-medium">32%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.traditionalMedia}`}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block transition-colors text-lg font-medium">
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoastalDevelopments; 