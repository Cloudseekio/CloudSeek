import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, ArrowUpRight, Clock, BarChart3, Users, Award, Star, Trophy, CheckCircle, Building, Home, Key } from 'lucide-react';

const CaseStudiesIndex: React.FC = () => {
  // Import the existing case studies data with enhanced details
  const caseStudies = [
    {
      id: 'tech-forward',
      title: 'TechForward',
      subtitle: 'Customer Lifetime Value Enhancement',
      description: 'How we helped a SaaS provider increase customer lifetime value and reduce churn through targeted engagement strategies.',
      image: '/images/case-studies/tech-forward.jpg',
      industry: 'Technology',
      results: [
        '3.2x increase in customer lifetime value',
        '64% reduction in churn rate',
        '42% improvement in customer satisfaction'
      ],
      slug: 'techforward-customer-lifetime-value',
      featured: true,
      size: 'large',
      testimonial: "The Salesforce solution implemented by CloudSeek has transformed our customer engagement strategy. We're seeing unprecedented retention rates.",
      client: "Sarah Johnson, CTO"
    },
    {
      id: 'global-financial-corp',
      title: 'Global Financial Corp',
      subtitle: 'Leading Multinational Financial Services Company',
      description: 'How we unified customer data and streamlined operations across 30+ countries for a global financial leader.',
      image: '/images/case-studies/global-financial.jpg',
      industry: 'Financial Services',
      results: [
        '30% increase in customer satisfaction',
        '25% reduction in operational costs',
        '42% improvement in cross-border efficiency'
      ],
      slug: 'global-financial-corp',
      featured: false,
      size: 'large',
      testimonial: "CloudSeek delivered a solution that finally united our disparate systems across regions, giving us the global visibility we needed.",
      client: "Robert Taylor, Global Operations Director"
    },
    // Enhanced real estate case studies
    {
      id: 'luxe-properties',
      title: 'LUXE Properties',
      subtitle: 'Premier Luxury Real Estate Brokerage',
      description: 'How we transformed lead management and client engagement for a luxury real estate firm with operations across major metropolitan markets.',
      image: '/images/case-studies/luxe-properties.jpg',
      industry: 'Real Estate',
      results: [
        '78% increase in lead conversion rate',
        '45% reduction in sales cycle length',
        '3.2x improvement in agent productivity'
      ],
      slug: 'luxe-properties',
      featured: true,
      size: 'large',
      testimonial: "Our agents can now focus on high-value activities instead of administrative tasks. The personalized customer journeys have dramatically improved our client experience and accelerated our sales process.",
      client: "Alexandra Reynolds, Director of Sales",
      challenge: "Managing luxury client relationships across multiple touchpoints while tracking high-value property inventory",
      solution: "Custom Salesforce implementation with property portfolio management and automated client journeys"
    },
    {
      id: 'coastal-developments',
      title: 'Coastal Developments',
      subtitle: 'Innovative Property Development Group',
      description: 'How we streamlined project management and investor reporting for a growing development company with luxury waterfront projects.',
      image: '/images/case-studies/coastal-developments.jpg',
      industry: 'Real Estate',
      results: [
        '35% faster project delivery times',
        '40% reduction in reporting effort',
        '62% improvement in stakeholder satisfaction'
      ],
      slug: 'coastal-developments',
      featured: true,
      size: 'medium',
      testimonial: "The reporting automation has saved us countless hours and dramatically improved our investor communications. Our project visibility has never been better.",
      client: "Jonathan Parker, CEO",
      challenge: "Complex project management across multiple development sites with numerous stakeholders and contractors",
      solution: "Integrated Salesforce platform connecting project management, investor relations, and contractor coordination"
    },
    {
      id: 'metro-property-management',
      title: 'Metro Property Management',
      subtitle: 'Streamlined Operations for Property Manager',
      description: 'How we helped a growing property management firm automate workflows and improve tenant satisfaction across their residential portfolio.',
      image: '/images/case-studies/metro-property.jpg',
      industry: 'Real Estate',
      results: [
        '50% reduction in maintenance response time',
        '65% decrease in paperwork processing',
        '28% increase in tenant satisfaction scores'
      ],
      slug: 'metro-property-management',
      featured: false,
      size: 'medium',
      testimonial: "CloudSeek's solution has completely transformed our maintenance management and tenant communications. We've seen dramatic improvements in our operational efficiency.",
      client: "David Wilson, COO",
      challenge: "Managing thousands of units with diverse maintenance needs and tenant communication challenges",
      solution: "Custom tenant portal with automated maintenance workflows and communication tools"
    },
    {
      id: 'strategic-consulting-group',
      title: 'Strategic Consulting Group',
      subtitle: 'From Siloed Data to 360° Client View',
      description: 'How we unified fragmented data across departments to create a complete view of client relationships.',
      image: '/images/case-studies/strategic-consulting.jpg',
      industry: 'Professional Services',
      results: [
        '50% reduction in operational costs',
        '32% increase in consultant utilization',
        '68% faster access to client information'
      ],
      slug: 'strategic-consulting-360-view',
      featured: false,
      size: 'medium',
      testimonial: "Having a 360° view of our clients has completely transformed our consulting approach and dramatically improved our efficiency.",
      client: "Michael Chen, Managing Partner"
    },
    {
      id: 'retailnxt',
      title: 'RetailNXT',
      subtitle: 'Customer Retention Improvement',
      description: 'How we helped a retailer transform their customer experience to significantly improve retention and repeat purchases.',
      image: '/images/case-studies/retailnxt.jpg',
      industry: 'Retail',
      results: [
        '63% increase in customer retention',
        '40% increase in repeat purchases',
        '37% increase in customer lifetime value'
      ],
      slug: 'retailnxt-customer-retention',
      featured: true,
      size: 'medium',
      testimonial: "The retention strategies implemented through our Salesforce solution have had a direct impact on our bottom line.",
      client: "Jessica Martinez, VP of Customer Experience"
    },
    {
      id: 'healthtech-innovations',
      title: 'HealthTech Innovations',
      subtitle: 'Revolutionary Healthcare Technology Provider',
      description: 'How we streamlined patient data management and enhanced compliance across 200+ hospitals nationwide.',
      image: '/images/case-studies/healthtech.jpg',
      industry: 'Healthcare',
      results: [
        '40% improvement in patient data retrieval',
        '35% reduction in administrative overhead',
        '28% increase in patient satisfaction'
      ],
      slug: 'healthtech-innovations',
      featured: false,
      size: 'medium',
      testimonial: "The HIPAA-compliant solution has transformed how our medical professionals access and utilize patient information.",
      client: "Dr. Sarah Johnson, Chief Medical Information Officer"
    },
    {
      id: 'precision-manufacturing',
      title: 'Precision Manufacturing Inc.',
      subtitle: 'Leading Manufacturer in Precision Engineering',
      description: 'How we enhanced supply chain visibility and optimized production workflows for a precision engineering leader.',
      image: '/images/case-studies/precision-manufacturing.jpg',
      industry: 'Manufacturing',
      results: [
        '20% reduction in production delays',
        '32% improvement in inventory forecasting',
        '18% increase in on-time delivery'
      ],
      slug: 'precision-manufacturing',
      featured: false,
      size: 'small',
      testimonial: "With our new supply chain visibility, we've dramatically improved our ability to meet delivery deadlines and manage inventory.",
      client: "Michael Chen, VP of Operations"
    },
    {
      id: 'luxehome-furnishings',
      title: 'LuxeHome Furnishings',
      subtitle: 'E-commerce Personalization Strategy',
      description: 'How we transformed a premium home goods retailer with AI-driven personalization to increase conversion rates and average order value.',
      image: '/images/case-studies/luxehome-furnishings.jpg',
      industry: 'Retail',
      results: [
        '42% increase in conversion rate',
        '38% reduction in cart abandonment',
        '27% higher average order value'
      ],
      slug: 'luxehome-furnishings',
      featured: true,
    },
    {
      id: 'fashion-forward',
      title: 'FashionForward',
      subtitle: 'Omnichannel Retail Transformation',
      description: 'How we helped a premium fashion retailer implement a seamless omnichannel strategy to improve customer experience and boost sales across all channels.',
      image: '/images/case-studies/fashion-forward.jpg',
      industry: 'Retail',
      results: [
        '48% increase in cross-channel conversion',
        '35% growth in customer lifetime value',
        '42% increase in mobile revenue'
      ],
      slug: 'fashion-forward',
      featured: true
    },
    {
      id: 'tech-vision',
      title: 'TechVision',
      subtitle: 'Sales Process Transformation',
      description: 'How we helped a growing IT solutions provider increase sales by 42% through an optimized Sales Cloud implementation.',
      image: '/images/case-studies/tech-vision.jpg',
      industry: 'Technology',
      results: [
        '42% increase in overall sales',
        '68% improvement in lead response time',
        '57% reduction in sales cycle length'
      ],
      slug: 'tech-vision',
      featured: true,
      size: 'medium',
      testimonial: "CloudSeek's Sales Cloud implementation transformed our entire sales organization. The visibility we now have into our pipeline has dramatically improved our forecasting accuracy.",
      client: "Michael Reeves, VP of Sales"
    },
    {
      id: 'health-plus',
      title: 'HealthPlus',
      subtitle: 'Patient Support Transformation',
      description: 'How we helped a healthcare provider reduce support response time by 68% and improve patient satisfaction with Service Cloud.',
      image: '/images/case-studies/health-plus.jpg',
      industry: 'Healthcare',
      results: [
        '68% reduction in support response time',
        '92% improvement in patient satisfaction',
        '41% increase in first-call resolution rate'
      ],
      slug: 'health-plus',
      featured: true,
      size: 'medium',
      testimonial: "The Service Cloud implementation has transformed how we support our patients. Our staff now has instant access to the information they need.",
      client: "Dr. Jennifer Reyes, CMO"
    },
    {
      id: 'retail-max',
      title: 'RetailMax',
      subtitle: 'Email Marketing Transformation',
      description: 'How we helped a retail chain increase email engagement by 165% through personalized marketing experiences.',
      image: '/images/case-studies/retail-max.jpg',
      industry: 'Retail',
      results: [
        '165% increase in email engagement',
        '78% improvement in click-through rates',
        '52% growth in email-attributed revenue'
      ],
      slug: 'retail-max',
      featured: true,
      size: 'medium',
      testimonial: "The Marketing Cloud implementation has revolutionized how we communicate with our customers. We've seen unprecedented engagement.",
      client: "Lisa Chen, VP of Digital Marketing"
    },
    {
      id: 'tech-solutions',
      title: 'TechSolutions',
      subtitle: 'Lead Qualification Transformation',
      description: 'How we helped a B2B technology services company increase qualified leads by 215% through Pardot implementation.',
      image: '/images/case-studies/tech-solutions.jpg',
      industry: 'Technology Services',
      results: [
        '215% increase in qualified leads',
        '68% reduction in sales cycle',
        '42% improvement in conversion rate'
      ],
      slug: 'tech-solutions',
      featured: true,
      size: 'medium',
      testimonial: "The Pardot implementation has completely transformed our lead management process. The quality of leads is exceptional.",
      client: "Michael Reynolds, VP of Marketing"
    },
    {
      id: 'global-tech',
      title: 'GlobalTech',
      subtitle: 'AI-Powered Conversion Optimization',
      description: 'How we helped an enterprise software provider achieve 40% higher conversion rates with Einstein AI implementation.',
      image: '/images/case-studies/global-tech.jpg',
      industry: 'Technology',
      results: [
        '40% increase in conversion rates',
        '53% improvement in engagement',
        '35% decrease in acquisition costs'
      ],
      slug: 'global-tech',
      featured: true,
      size: 'large',
      testimonial: "Einstein AI has transformed how we understand and interact with our customers. We're now able to predict customer needs with remarkable accuracy.",
      client: "Elena Rodriguez, Chief Digital Officer"
    },
  ];

  // Filter featured case studies
  const featuredCaseStudies = caseStudies.filter(study => study.featured);
  
  // Filter real estate case studies for special showcase
  const realEstateCaseStudies = caseStudies.filter(study => study.industry === 'Real Estate');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      <main className="flex-grow">
        {/* Hero Section - Updated to Dark Gray */}
        <section className="relative bg-gray-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Client Success Stories
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              See how we've helped organizations across industries achieve exceptional results with 
              tailored Salesforce solutions and strategic consulting.
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Featured Case Study - Hero Style */}
            <div className="mb-16">
              <div className="bg-white shadow border border-gray-100 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full">
                      <img 
                        src={featuredCaseStudies[0].image} 
                        alt={featuredCaseStudies[0].title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 inline-block mb-4">
                      {featuredCaseStudies[0].industry}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      {featuredCaseStudies[0].title}
                    </h2>
                    <p className="text-blue-600 mb-4">{featuredCaseStudies[0].subtitle}</p>
                    <p className="text-gray-600 mb-6">
                      {featuredCaseStudies[0].description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Results:</h4>
                      <ul className="space-y-1">
                        {featuredCaseStudies[0].results.map((result, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-gray-700">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link 
                      to={`/case-studies/${featuredCaseStudies[0].slug}`}
                      className="text-blue-600 font-medium flex items-center hover:text-blue-800"
                    >
                      Read case study <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real Estate Excellence Section */}
            <div className="mb-20">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Real Estate Excellence</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  See how we've helped real estate companies transform their operations and enhance client experiences with tailored Salesforce solutions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {realEstateCaseStudies.map((study, index) => (
                  <div key={index} className="group relative overflow-hidden shadow border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img 
                      src={study.image} 
                      alt={study.title} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-0 left-0 w-full h-full p-6 flex flex-col justify-between z-20">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 inline-block">
                          {study.industry}
                        </span>
                      </div>
                      <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {study.title}
                        </h3>
                        <p className="text-white mb-3">{study.subtitle}</p>
                        <Link 
                          to={`/case-studies/${study.slug}`}
                          className="bg-white/90 text-blue-600 px-4 py-2 inline-flex items-center text-sm font-medium hover:bg-white transition-colors"
                        >
                          Read case study <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Statistics Banner - Updated to Dark Gray */}
            <div className="relative bg-gray-900 p-10 mb-20 overflow-hidden">
              <div className="text-center mb-10 relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2">Our Impact Across Industries</h2>
                <p className="text-white">Delivering measurable results for our clients</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <div className="text-center transform hover:scale-105 transition-transform">
                  <div className="bg-white/10 w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Users className="text-white" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">45+</div>
                  <div className="text-white">Enterprise Clients</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-transform">
                  <div className="bg-white/10 w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <BarChart3 className="text-white" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">58%</div>
                  <div className="text-white">Avg. Efficiency Gain</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-transform">
                  <div className="bg-white/10 w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Clock className="text-white" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">12+</div>
                  <div className="text-white">Years Experience</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-transform">
                  <div className="bg-white/10 w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Award className="text-white" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">15</div>
                  <div className="text-white">Industry Awards</div>
                </div>
              </div>
            </div>
            
            {/* Final Case Studies Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {caseStudies.slice(0, 3).map((study, index) => (
                <div key={`final-${index}`} className="group relative overflow-hidden shadow border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-0 left-0 w-full h-full p-6 flex flex-col justify-between z-20">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 inline-block">
                        {study.industry}
                      </span>
                    </div>
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {study.title}
                      </h3>
                      <p className="text-white mb-3">{study.subtitle}</p>
                      <Link 
                        to={`/case-studies/${study.slug}`}
                        className="bg-white/90 text-blue-600 px-4 py-2 inline-flex items-center text-sm font-medium hover:bg-white transition-colors"
                      >
                        Read case study <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Updated to Dark Gray */}
        <section className="relative bg-gray-900 py-20 overflow-hidden my-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization achieve exceptional results with Salesforce solutions tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-white text-blue-600 px-8 py-3 hover:bg-gray-100 transition-colors text-lg font-medium group flex items-center justify-center"
              >
                Schedule a Consultation <ArrowRight size={20} className="ml-2 group-hover:ml-3 transition-all" />
              </Link>
              <Link 
                to="/services" 
                className="bg-gray-800 border border-white/20 text-white px-8 py-3 hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CaseStudiesIndex; 