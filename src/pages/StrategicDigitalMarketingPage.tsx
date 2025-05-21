import React from 'react';
import { ChevronRight, CheckCircle, Target, Mail, BarChart3, TrendingUp, Zap, Search, MessageSquare, Instagram, ArrowUpRight, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const StrategicDigitalMarketingPage: React.FC = () => {
  const marketingServices = [
    {
      title: 'Email Marketing Automation',
      description: 'Personalized, targeted email campaigns that nurture leads and drive conversions through the Salesforce Marketing Cloud.',
      icon: <Mail size={24} />,
      benefits: [
        'Automated drip campaigns based on user behavior',
        'A/B testing to optimize open and click-through rates',
        'Personalized content delivery based on customer data',
        'Detailed analytics and ROI tracking'
      ]
    },
    {
      title: 'Social Media Marketing',
      description: 'Strategic social campaigns that build brand awareness, engagement, and drive qualified traffic to your digital properties.',
      icon: <Instagram size={24} />,
      benefits: [
        'Content strategy aligned with business objectives',
        'Audience targeting and segmentation',
        'Paid social advertising campaigns',
        'Performance monitoring and optimization'
      ]
    },
    {
      title: 'Search Engine Marketing',
      description: 'Data-driven SEO and SEM strategies that improve visibility and drive high-intent traffic to your website.',
      icon: <Search size={24} />,
      benefits: [
        'Keyword research and competitive analysis',
        'On-page and technical SEO optimization',
        'Google Ads campaign management',
        'Conversion rate optimization'
      ]
    },
    {
      title: 'Content Marketing',
      description: 'Compelling content that establishes thought leadership, engages your audience, and drives action.',
      icon: <MessageSquare size={24} />,
      benefits: [
        'Content strategy development',
        'Blog posts, whitepapers, and case studies',
        'Multimedia content creation',
        'Content distribution and promotion'
      ]
    },
    {
      title: 'Marketing Analytics',
      description: 'Comprehensive performance tracking and insights that inform data-driven marketing decisions.',
      icon: <BarChart3 size={24} />,
      benefits: [
        'Custom marketing dashboards',
        'Multi-channel attribution modeling',
        'Customer journey analysis',
        'ROI and performance reporting'
      ]
    },
    {
      title: 'Integrated Marketing Campaigns',
      description: 'Cohesive multi-channel campaigns that deliver consistent messaging across all customer touchpoints.',
      icon: <Zap size={24} />,
      benefits: [
        'Unified strategy across all channels',
        'Coordinated messaging and creative',
        'Cross-channel performance tracking',
        'Continuous optimization based on results'
      ]
    }
  ];

  const successMetrics = [
    {
      metric: '147%',
      description: 'Average ROI on digital marketing campaigns',
      icon: <PieChart size={32} />
    },
    {
      metric: '68%',
      description: 'Increase in qualified lead generation',
      icon: <Target size={32} />
    },
    {
      metric: '42%',
      description: 'Reduction in customer acquisition costs',
      icon: <TrendingUp size={32} />
    },
    {
      metric: '3.4x',
      description: 'Improvement in email engagement rates',
      icon: <Mail size={32} />
    }
  ];

  const caseStudies = [
    {
      client: 'TechInnovate Solutions',
      industry: 'SaaS',
      challenge: 'Low conversion rates from website visitors despite high traffic',
      solution: 'Implemented personalized content strategy with Marketing Cloud and Journey Builder',
      results: [
        '215% increase in lead conversion rates',
        '47% improvement in MQL to SQL conversion',
        '28% reduction in cost per acquisition'
      ],
      image: '/images/case-studies/tech-innovate.jpg'
    },
    {
      client: 'Global Retail Alliance',
      industry: 'Retail',
      challenge: 'Fragmented customer data leading to inconsistent marketing experiences',
      solution: 'Created unified customer profiles and omnichannel marketing automation',
      results: [
        '63% increase in email engagement',
        '42% growth in repeat purchase rate',
        '3.1x ROI on digital marketing spend'
      ],
      image: '/images/case-studies/global-retail.jpg'
    },
    {
      client: 'HealthServe Network',
      industry: 'Healthcare',
      challenge: 'Inability to effectively nurture leads through complex buying cycle',
      solution: 'Developed sophisticated multi-touch attribution and nurture campaigns',
      results: [
        '78% improvement in lead nurturing effectiveness',
        '52% shorter sales cycles',
        '36% increase in marketing-attributed revenue'
      ],
      image: '/images/case-studies/healthserve.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Strategic Digital Marketing Campaigns That Drive Results
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Data-driven digital marketing strategies that connect with your audience, build your brand, and accelerate your business growth.
              </p>
              <Link to="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                Discuss Your Marketing Strategy
              </Link>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img 
                src="/images/digital-marketing-hero.jpg" 
                alt="Digital Marketing Strategy" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {successMetrics.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{item.metric}</div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Digital Marketing Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From strategy to execution, we provide end-to-end digital marketing solutions that deliver measurable results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketingServices.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">KEY BENEFITS:</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-blue-600">
                          <CheckCircle size={16} />
                        </div>
                        <p className="ml-3 text-gray-600 text-sm">{benefit}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Process Section */}
      <section className="py-20 bg-gray-50 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Digital Marketing Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that consistently delivers outstanding marketing results
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-blue-100"></div>
            
            <div className="space-y-20">
              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 z-10"></div>
                  <span className="inline-block bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4 md:hidden">1</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Discovery & Analysis</h3>
                  <p className="text-gray-600">
                    We begin by deeply understanding your business, audience, and objectives. Our team analyzes your current marketing performance, competitive landscape, and market opportunities.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <img 
                    src="/images/marketing-discovery.jpg" 
                    alt="Discovery & Analysis" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-1 md:order-2 md:text-left">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 z-10"></div>
                  <span className="inline-block bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4 md:hidden">2</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Strategy Development</h3>
                  <p className="text-gray-600">
                    Based on our findings, we craft a comprehensive marketing strategy tailored to your specific goals. This includes channel selection, messaging, creative direction, and detailed execution plans.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12 order-2 md:order-1">
                  <img 
                    src="/images/marketing-strategy.jpg" 
                    alt="Strategy Development" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 z-10"></div>
                  <span className="inline-block bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4 md:hidden">3</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Content & Creative</h3>
                  <p className="text-gray-600">
                    Our team develops compelling content and creative assets that resonate with your target audience and effectively communicate your value proposition across all selected channels.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <img 
                    src="/images/marketing-content.jpg" 
                    alt="Content & Creative" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-1 md:order-2 md:text-left">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 z-10"></div>
                  <span className="inline-block bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4 md:hidden">4</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Campaign Execution</h3>
                  <p className="text-gray-600">
                    We implement your marketing campaigns with precision, ensuring proper tracking is in place to measure performance. Our team manages the day-to-day execution across all channels.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12 order-2 md:order-1">
                  <img 
                    src="/images/marketing-execution.jpg" 
                    alt="Campaign Execution" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 z-10"></div>
                  <span className="inline-block bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4 md:hidden">5</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Analysis & Optimization</h3>
                  <p className="text-gray-600">
                    We continuously monitor campaign performance, conduct A/B testing, and make data-driven optimizations to maximize results and ROI throughout the campaign lifecycle.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <img 
                    src="/images/marketing-analysis.jpg" 
                    alt="Analysis & Optimization" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-1 md:order-2 md:text-left">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 z-10"></div>
                  <span className="inline-block bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4 md:hidden">6</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Reporting & Insights</h3>
                  <p className="text-gray-600">
                    We provide comprehensive reporting on all KPIs and deliver actionable insights to continuously improve future marketing efforts and inform strategic business decisions.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12 order-2 md:order-1">
                  <img 
                    src="/images/marketing-reporting.jpg" 
                    alt="Reporting & Insights" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Marketing Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our strategic marketing campaigns have delivered exceptional results for our clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={study.image} 
                    alt={study.client} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{study.client}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {study.industry}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">CHALLENGE:</h4>
                    <p className="text-gray-600 text-sm">{study.challenge}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">SOLUTION:</h4>
                    <p className="text-gray-600 text-sm">{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">RESULTS:</h4>
                    <ul className="space-y-1">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="flex-shrink-0 mt-1 text-blue-600">
                            <CheckCircle size={14} />
                          </div>
                          <p className="ml-2 text-gray-600 text-sm">{result}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t">
                  <Link 
                    to={`/case-studies/${study.client.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-blue-600 font-medium text-sm flex items-center hover:text-blue-800"
                  >
                    Read full case study <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Technologies Section */}
      <section className="py-20 bg-gray-50 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Marketing Tools & Technologies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We leverage industry-leading marketing technology to power your campaigns
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg text-center">
              <img src="/images/tools/salesforce-marketing-cloud.svg" alt="Salesforce Marketing Cloud" className="h-12 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">Marketing Cloud</h3>
            </div>
            <div className="bg-white p-8 rounded-lg text-center">
              <img src="/images/tools/pardot.svg" alt="Pardot" className="h-12 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">Pardot</h3>
            </div>
            <div className="bg-white p-8 rounded-lg text-center">
              <img src="/images/tools/google-analytics.svg" alt="Google Analytics" className="h-12 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">Google Analytics</h3>
            </div>
            <div className="bg-white p-8 rounded-lg text-center">
              <img src="/images/tools/google-ads.svg" alt="Google Ads" className="h-12 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">Google Ads</h3>
            </div>
            <div className="bg-white p-8 rounded-lg text-center">
              <img src="/images/tools/hubspot.svg" alt="HubSpot" className="h-12 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">HubSpot</h3>
            </div>
            <div className="bg-white p-8 rounded-lg text-center">
              <img src="/images/tools/semrush.svg" alt="SEMrush" className="h-12 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">SEMrush</h3>
            </div>
            <div className="bg-white p-8 rounded-lg text-center">
              <img src="/images/tools/adobe-creative-cloud.svg" alt="Adobe Creative Cloud" className="h-12 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">Adobe Creative Cloud</h3>
            </div>
            <div className="bg-white p-8 rounded-lg text-center">
              <img src="/images/tools/tableau.svg" alt="Tableau" className="h-12 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900">Tableau</h3>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our digital marketing services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How long does it take to see results from digital marketing campaigns?</h3>
              <p className="text-gray-600">
                The timeline varies based on the channels and objectives, but you can typically expect to see initial results within 1-3 months. Paid advertising can show results more quickly, while SEO and content marketing may take longer to demonstrate their full impact.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How do you measure the success of marketing campaigns?</h3>
              <p className="text-gray-600">
                We establish clear KPIs aligned with your business objectives before launching any campaign. These might include metrics like conversion rates, cost per acquisition, ROI, engagement rates, and revenue generated. We provide comprehensive reporting and insights throughout the campaign lifecycle.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Do you work with businesses in specific industries?</h3>
              <p className="text-gray-600">
                We have experience across a wide range of industries, with particular expertise in technology, healthcare, financial services, manufacturing, and professional services. Our team takes the time to understand the unique challenges and opportunities in your specific industry.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How do you integrate Salesforce with marketing campaigns?</h3>
              <p className="text-gray-600">
                We leverage Salesforce Marketing Cloud, Pardot, and other Salesforce tools to create seamless, data-driven marketing campaigns. This integration ensures consistent messaging across channels, enables sophisticated marketing automation, and provides complete visibility into the customer journey.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">What budget do I need for an effective digital marketing campaign?</h3>
              <p className="text-gray-600">
                Effective marketing budgets vary widely based on your industry, objectives, and competitive landscape. We work with clients across various budget ranges and focus on maximizing ROI regardless of budget size. We'll provide transparent recommendations based on your specific goals.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How often will we receive reports on our marketing campaigns?</h3>
              <p className="text-gray-600">
                We typically provide detailed monthly reports with key insights and recommendations, along with access to real-time dashboards for continuous monitoring. For active campaigns, we also schedule regular check-ins to discuss performance and strategize optimizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16 px-4 rounded-2xl overflow-hidden w-[94%] mx-auto mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to transform Your Digital Marketing?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Let our experts guide you through the transformation. Discover how our marketing strategies can be tailored 
            to your specific business needs and drive measurable results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition"
            >
              Schedule a Demo <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 font-medium py-3 px-6 rounded-md transition"
            >
              Contact Our Team <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StrategicDigitalMarketingPage; 