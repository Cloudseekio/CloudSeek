import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cloud, 
  Code, 
  Briefcase, 
  BarChart, 
  Layout, 
  Smartphone, 
  Users, 
  Headphones, 
  MessageSquare,
  Zap,
  Database,
  Settings,
  ChevronRight
} from 'lucide-react';

const ServicesPage: React.FC = () => {
  // Define service categories
  const serviceCategories = [
    {
      title: "Salesforce Solutions",
      description: "Comprehensive Salesforce services to maximize your CRM investment",
      services: [
        {
          title: "Salesforce Implementation",
          description: "End-to-end implementation services to get your Salesforce instance up and running efficiently.",
          icon: <Cloud className="w-10 h-10 text-blue-600" />,
          link: "/salesforce-implementation"
        },
        {
          title: "Custom Salesforce Solutions",
          description: "Tailored Salesforce solutions designed to meet your unique business requirements and objectives.",
          icon: <Code className="w-10 h-10 text-blue-600" />,
          link: "/custom-salesforce-solutions"
        },
        {
          title: "Salesforce Consulting",
          description: "Strategic guidance and implementation expertise to maximize your Salesforce ROI.",
          icon: <Briefcase className="w-10 h-10 text-blue-600" />,
          link: "/salesforce-consulting"
        }
      ]
    },
    {
      title: "Salesforce Cloud Products",
      description: "Expert implementation and support for core Salesforce cloud offerings",
      services: [
        {
          title: "Sales Cloud",
          description: "Boost sales performance with the world's #1 sales solution.",
          icon: <Users className="w-10 h-10 text-blue-600" />,
          link: "/sales-cloud"
        },
        {
          title: "Service Cloud",
          description: "Deliver exceptional customer service across all channels.",
          icon: <Headphones className="w-10 h-10 text-blue-600" />,
          link: "/service-cloud"
        },
        {
          title: "Marketing Cloud",
          description: "Create personalized customer journeys that drive engagement and conversion.",
          icon: <MessageSquare className="w-10 h-10 text-blue-600" />,
          link: "/marketing-cloud"
        },
        {
          title: "Experience Cloud",
          description: "Build branded digital experiences for customers, partners, and employees.",
          icon: <Zap className="w-10 h-10 text-blue-600" />,
          link: "/experience-cloud"
        }
      ]
    },
    {
      title: "Digital Services",
      description: "Comprehensive digital solutions to transform your online presence",
      services: [
        {
          title: "Strategic Digital Marketing",
          description: "Data-driven marketing strategies that deliver measurable results and drive growth.",
          icon: <BarChart className="w-10 h-10 text-blue-600" />,
          link: "/services/strategic-digital-marketing"
        },
        {
          title: "Web Design",
          description: "Beautiful, intuitive digital experiences that elevate your brand and engage your audience.",
          icon: <Layout className="w-10 h-10 text-blue-600" />,
          link: "/services/web-design"
        },
        {
          title: "Mobile Development",
          description: "Powerful, intuitive mobile applications that engage users and deliver exceptional experiences.",
          icon: <Smartphone className="w-10 h-10 text-blue-600" />,
          link: "/services/mobile-development"
        }
      ]
    },
    {
      title: "Advanced Salesforce Solutions",
      description: "Specialized services for enhanced Salesforce capabilities",
      services: [
        {
          title: "Einstein AI Integration",
          description: "Harness the power of artificial intelligence to unlock insights and automate processes.",
          icon: <Database className="w-10 h-10 text-blue-600" />,
          link: "/einstein-ai"
        },
        {
          title: "Pardot Marketing Automation",
          description: "Streamline and enhance your B2B marketing efforts with powerful automation tools.",
          icon: <Settings className="w-10 h-10 text-blue-600" />,
          link: "/pardot"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive solutions to transform your business with Salesforce and digital innovation
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Can Help Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From Salesforce implementation to digital marketing, we offer end-to-end solutions tailored to your unique needs
            </p>
          </div>

          {/* Service Categories */}
          <div className="space-y-20">
            {serviceCategories.map((category, index) => (
              <div key={`category-${index}`} className="mb-16">
                <div className="border-b border-gray-200 pb-4 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                  <p className="text-gray-600 mt-2">{category.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.services.map((service, serviceIndex) => (
                    <Link 
                      key={`service-${index}-${serviceIndex}`}
                      to={service.link}
                      className="group"
                    >
                      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            {service.icon}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {service.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-4 flex-grow">
                          {service.description}
                        </p>
                        <div className="flex items-center text-blue-600 font-medium mt-auto">
                          Learn more
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that delivers consistent results across all our service offerings
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discovery</h3>
              <p className="text-gray-600">
                We take the time to understand your business, challenges, and objectives to create a tailored approach.
              </p>
              <div className="absolute top-12 right-0 hidden md:block">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Strategy</h3>
              <p className="text-gray-600">
                We develop a comprehensive roadmap aligned with your business goals and technical requirements.
              </p>
              <div className="absolute top-12 right-0 hidden md:block">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Implementation</h3>
              <p className="text-gray-600">
                Our experts execute the plan with precision, keeping you involved throughout the process.
              </p>
              <div className="absolute top-12 right-0 hidden md:block">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Optimization</h3>
              <p className="text-gray-600">
                We provide ongoing support and continuous improvement to maximize your return on investment.
              </p>
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
              Answers to common questions about our services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How long does a typical Salesforce implementation take?</h3>
              <p className="text-gray-600">
                Implementation timelines vary based on complexity, but typically range from 4-12 weeks. During our initial consultation, we'll provide a detailed timeline based on your specific requirements.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Do you provide training for our team?</h3>
              <p className="text-gray-600">
                Yes, comprehensive training is included with all our implementations. We ensure your team is confident using the new systems before we consider the project complete.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Can you integrate Salesforce with our existing systems?</h3>
              <p className="text-gray-600">
                Absolutely. We specialize in integrating Salesforce with a wide range of systems including ERP, marketing automation, accounting software, and custom applications.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What support do you offer after implementation?</h3>
              <p className="text-gray-600">
                We offer various support packages ranging from basic troubleshooting to comprehensive managed services, ensuring your Salesforce environment remains optimized for your evolving business needs.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/faq" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
              View all FAQs
              <ChevronRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Certifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We maintain the highest level of expertise with industry-leading certifications
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <img 
                src="/images/salesforce-certified-partner.png" 
                alt="Salesforce Certified Partner" 
                className="h-16 mb-4"
              />
              <p className="text-gray-900 font-medium text-center">Salesforce Certified Partner</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <img 
                src="/images/certified-developer.png" 
                alt="Certified Developer" 
                className="h-16 mb-4"
              />
              <p className="text-gray-900 font-medium text-center">Certified Salesforce Developer</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <img 
                src="/images/certified-administrator.png" 
                alt="Certified Administrator" 
                className="h-16 mb-4"
              />
              <p className="text-gray-900 font-medium text-center">Certified Salesforce Administrator</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <img 
                src="/images/certified-consultant.png" 
                alt="Certified Consultant" 
                className="h-16 mb-4"
              />
              <p className="text-gray-900 font-medium text-center">Certified Salesforce Consultant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call-to-Action Section */}
      <section className="relative py-20 mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 skew-y-3 transform origin-top-right -z-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 pt-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your Business with CloudSeek?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Let's discuss how our services can help you achieve your business objectives and drive growth. Schedule a no-obligation consultation today.
              </p>
              <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
                <Link 
                  to="/contact" 
                  className="w-full md:w-auto bg-white text-blue-700 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-300 text-lg font-medium flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  Schedule a Consultation
                  <ChevronRight size={20} className="ml-2" />
                </Link>
                <Link 
                  to="/case-studies" 
                  className="w-full md:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-all duration-300 text-lg font-medium flex items-center justify-center"
                >
                  View Case Studies
                  <ChevronRight size={20} className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/cta-illustration.svg" 
                alt="Solutions Illustration" 
                className="max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage; 