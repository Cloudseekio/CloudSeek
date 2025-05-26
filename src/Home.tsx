import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, Menu, X, ChevronLeft, ChevronRight, Layout, ArrowRight, BarChart, Headphones, Mail, Target, Brain } from 'lucide-react';
import RotatingTextSlider from './components/RotatingTextSlider';
import { Link } from 'react-router-dom';
import { SmoothInfiniteCarousel } from './components/SmoothInfiniteCarousel';
import { BLOG_POSTS } from './data/blogPosts';
import HeroSection from './components/HeroSection';

// Helper function to encode form data for Netlify Forms
const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    {
      title: "Sales Cloud",
      description: "Sell faster, smarter, and more efficiently with Sales Cloud, the #1 AI CRM. Empower sellers, sales leaders, and operations with data-driven insights and automation.",
      icon: "/icons/sales-cloud.svg"
    },
    {
      title: "Service Cloud",
      description: "Transform how service teams deliver value across every customer touchpoint. Increase satisfaction and maximize efficiency with AI-powered service solutions.",
      icon: "/icons/service-cloud.svg"
    },
    {
      title: "Marketing Cloud",
      description: "Create personalized customer journeys and deliver the right message at the right time across all channels with AI-powered marketing automation.",
      icon: "/icons/marketing-cloud.svg"
    },
    {
      title: "Experience Cloud",
      description: "Build branded digital experiences that connect customers, partners, and employees. Create portals, websites, and apps that drive engagement and collaboration.",
      icon: "/icons/experience-cloud.svg"
    },
    {
      title: "Pardot",
      description: "Accelerate B2B marketing performance with intelligent automation. Generate and nurture high-quality leads with personalized campaigns and analytics.",
      icon: "/icons/pardot.svg"
    },
    {
      title: "Einstein AI",
      description: "Harness the power of AI to make smarter business decisions. Get predictive insights, automate tasks, and deliver personalized experiences at scale.",
      icon: "/icons/einstein-ai.svg"
    }
  ];

  const displayedCards = currentPage === 1 ? cards.slice(0, 3) : cards.slice(3, 6);

  // Debug logging
  console.log('Current Page:', currentPage);
  console.log('Displayed Cards:', displayedCards);

  // Service cards data
  const serviceCards = [
    {
      title: "Streamline your business with Salesforce implementation",
      description: "End-to-end Salesforce deployment tailored to your business needs, ensuring seamless integration and maximum efficiency.",
      link: "/services/salesforce-implementation"
    },
    {
      title: "Custom Salesforce solutions for your unique needs",
      description: "Tailor your Salesforce instance with custom applications, workflows, and integrations that match your business processes.",
      link: "/services/custom-salesforce-solutions"
    },
    {
      title: "Expert Salesforce consulting for optimal results",
      description: "Strategic guidance and technical expertise to maximize your Salesforce ROI and drive digital transformation.",
      link: "/services/salesforce-consulting"
    },
    {
      title: "Strategic Digital Marketing Campaigns",
      description: "Comprehensive digital marketing solutions including SEO, content strategy, social media management, and PPC advertising to boost your online presence.",
      link: "/services/strategic-digital-marketing"
    },
    {
      title: "Stunning Web & Interface Design",
      description: "Beautiful, intuitive digital experiences that elevate your brand and engage your audience.",
      link: "/services/web-design"
    },
    {
      title: "Native & Cross-Platform Mobile Solutions",
      description: "End-to-end mobile application development for iOS and Android, focusing on intuitive user experience and robust performance.",
      link: "/services/mobile-development"
    }
  ];

  // Calculate total pages
  const cardsPerPage = 3;
  const totalPages = Math.ceil(serviceCards.length / cardsPerPage);

  // Get current cards
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = serviceCards.slice(indexOfFirstCard, indexOfLastCard);

  // Page navigation functions - Make these useCallback to prevent unnecessary rerenders
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // Debug logging
  console.log('Current Page:', currentPage);
  console.log('Displayed Cards:', currentCards);

  console.log('Rendering Home component with Case Studies section');

  const rotatingTextItems = [
    {
      company: "Luxe Properties",
      text: "We helped ",
      metric: "37%",
      description: "increase in lead conversions.",
      link: "/case-studies/luxe-properties"
    },
    {
      company: "Techforward",
      text: " We boosted ",
      metric: "3.2x",
      description: "customer lifetime value.",
      link: "/case-studies/techforward-customer-lifetime-value"
    },
    {
      company: "Coastal Developments",
      text: "We helped ",
      metric: "215%",
      description: "increase in qualified leads.",
      link: "/case-studies/coastal-developments"
    }
  ];

  // Case Study section - modified to show only 2 per slide
  const caseStudySlides = [
    [
      {
        id: "luxe-properties",
        title: "Luxe Properties Group",
        subtitle: "Digital Transformation & CRM Implementation",
        description: "How we helped a luxury real estate brokerage increase lead conversion by 37% and improve agent productivity.",
        image: "/images/case-studies/luxe-properties-background.jpg",
        logo: "/images/case-studies/luxe-properties-logo.png",
        industry: "Real Estate",
        slug: "luxe-properties",
        statValue: "37%",
        statLabel: "Lead Conversion",
        clientName: "Jane Smith",
        clientTitle: "Product Manager, Luxe Properties Group"
      },
      {
        id: "techforward",
        title: "TechForward",
        subtitle: "Customer Lifetime Value Enhancement",
        description: "How we helped a SaaS provider increase customer lifetime value by 3.2x and reduce churn through targeted engagement strategies.",
        image: "/images/case-studies/techforward-background.jpg",
        logo: "/images/case-studies/techforward-logo.png", 
        industry: "Technology",
        slug: "techforward-customer-lifetime-value",
        statValue: "3.2x",
        statLabel: "Customer Lifetime Value",
        clientName: "Michael Chen",
        clientTitle: "CTO, TechForward"
      }
    ]
  ];

  const innovateCards = [
    {
      title: "Sales Cloud",
      description: "Streamline your sales process with powerful CRM tools",
      link: "/services/sales-cloud",
      icon: <BarChart className="h-12 w-12 text-blue-600" />
    },
    {
      title: "Service Cloud",
      description: "Transform customer service with intelligent solutions",
      link: "/services/service-cloud",
      icon: <Headphones className="h-12 w-12 text-blue-600" />
    },
    {
      title: "Marketing Cloud",
      description: "Create personalized customer journeys",
      link: "/services/marketing-cloud",
      icon: <Mail className="h-12 w-12 text-blue-600" />
    },
    {
      title: "Experience Cloud",
      description: "Build branded digital experiences",
      link: "/services/experience-cloud",
      icon: <Layout className="h-12 w-12 text-blue-600" />
    },
    {
      title: "Pardot",
      description: "B2B marketing automation excellence",
      link: "/services/pardot",
      icon: <Target className="h-12 w-12 text-blue-600" />
    },
    {
      title: "Einstein AI",
      description: "Unlock the power of AI for your business",
      link: "/services/einstein-ai",
      icon: <Brain className="h-12 w-12 text-blue-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FFFFFF] shadow-sm z-50">
        <div className="w-[94%] mx-auto">
          <div className="flex items-center h-[70px]">
            {/* Logo and Navigation Links */}
            <div className="flex-1 flex items-center space-x-8">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-2">
                <Cloud className="h-10 w-10 text-blue-600" />
                <span className="text-3xl font-bold text-slate-900">CloudSeek</span>
              </a>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/services" className="text-slate-700 hover:text-blue-600 font-normal text-[16px]">Services</Link>
                <Link to="/customers" className="text-slate-700 hover:text-blue-600 font-normal text-[16px]">Customers</Link>
                <Link to="/company" className="text-slate-700 hover:text-blue-600 font-normal text-[16px]">Company</Link>
                <Link to="/careers" className="text-slate-700 hover:text-blue-600 font-normal text-[16px]">Careers</Link>
              </div>
            </div>

            {/* Get In Touch Button - Stays on Right */}
            <div className="hidden md:block">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Get In Touch
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="w-[94%] mx-auto py-4 space-y-3">
              <a href="#" className="block text-gray-600 hover:text-blue-600 font-medium">Services</a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 font-medium">Customers</a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 font-medium">Company</a>
              <a href="#" className="block text-gray-600 hover:text-blue-600 font-medium">Careers</a>
              <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Get In Touch
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-3">
        <HeroSection />

        {/* 2. What would you like to get done? Section */}
        <section className="py-20 w-[94%] mx-auto bg-white" id="services-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What can we do for you?
              </h2>
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={prevPage}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700'
                  }`}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-blue-600">All Services</span>
                <button
                  onClick={nextPage}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700'
                  }`}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Service Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {currentCards.map((card, index) => (
                <div 
                  key={`service-card-${currentPage}-${index}`}
                  className="bg-gray-50 p-8 rounded-xl transition-all"
                >
                  {/* Map each card title to its proper link */}
                  {card.title.includes("Salesforce implementation") ? (
                    <Link to="/services/salesforce-implementation" className="block hover:no-underline">
                      {/* Blue accent line */}
                      <div className="w-12 h-1 bg-blue-600 mb-8"></div>
                      
                      {/* Card content */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {card.description}
                      </p>
                      
                      {/* Learn more link */}
                      <span 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Learn more
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  ) : card.title.includes("Custom Salesforce solutions") ? (
                    <Link to="/services/custom-salesforce-solutions" className="block hover:no-underline">
                      {/* Blue accent line */}
                      <div className="w-12 h-1 bg-blue-600 mb-8"></div>
                      
                      {/* Card content */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {card.description}
                      </p>
                      
                      {/* Learn more link */}
                      <span 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Learn more
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  ) : card.title.includes("Expert Salesforce consulting") ? (
                    <Link to="/services/salesforce-consulting" className="block hover:no-underline">
                      {/* Blue accent line */}
                      <div className="w-12 h-1 bg-blue-600 mb-8"></div>
                      
                      {/* Card content */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {card.description}
                      </p>
                      
                      {/* Learn more link */}
                      <span 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Learn more
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  ) : (
                    <>
                      {/* Blue accent line */}
                      <div className="w-12 h-1 bg-blue-600 mb-8"></div>
                      
                      {/* Card content */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {card.description}
                      </p>
                      
                      {/* Learn more link with dynamic routing based on card title */}
                      <Link 
                        to={
                          card.title.includes("Strategic Digital Marketing") 
                            ? "/services/strategic-digital-marketing"
                            : card.title.includes("Web & Interface Design")
                              ? "/services/web-design" 
                              : card.title.includes("Mobile Solutions")
                                ? "/services/mobile-development"
                                : "/services/mobile-development" // Default fallback
                        }
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Learn more
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-center gap-2 mt-8 md:hidden">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`mx-2 p-2 rounded-lg transition-colors ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-blue-600'
                  }`}
                  aria-label={`Page ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Digital Journey Section */}
        <section className="py-20 bg-gray-900 w-[94%] mx-auto rounded-2xl overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Success Story */}
            <div className="mb-12">
              <div className="mb-4 text-left">
                <RotatingTextSlider>
                  {rotatingTextItems.map((item, index) => (
                    <div key={index} className="text-gray-400 text-sm sm:text-base">
                      <span>{item.text}</span>
                      <Link 
                        to={item.link}
                        className="text-white font-semibold hover:text-blue-300 transition-colors mx-1"
                      >
                        {item.company}
                      </Link>
                      <span className="mx-1">to achieve</span>
                      <span className="text-green-400 font-semibold mx-1">{item.metric}</span>
                      <span>{item.description}</span>
                    </div>
                  ))}
                </RotatingTextSlider>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
                Drive Real Results with<br />
                Expert Collaboration
              </h2>

              <Link 
                to="/contact" 
                className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
              >
                Let's Collaborate
              </Link>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
              {/* Stat Card 1 */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  12+
                </p>
                <p className="text-gray-400">
                  Years of driving growth
                </p>
              </div>

              {/* Stat Card 2 */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  100+
                </p>
                <p className="text-gray-400">
                  Forward thinking experts
                </p>
              </div>

              {/* Stat Card 3 */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  300+
                </p>
                <p className="text-gray-400">
                  Digital Projects Delivered
                </p>
              </div>

              {/* Stat Card 4 */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  15+
                </p>
                <p className="text-gray-400">
                  Industries we served
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Innovate with CloudSeek Section - ADJUST BOTTOM PADDING */}
        <section className="py-12 pb-8 w-[94%] mx-auto bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Delivering Salesforce Solutions That Drive Business Outcomes
              </h2>
              <p className="text-xl text-gray-600">
                Leverage our comprehensive Salesforce solutions to drive innovation and efficiency across your organization.
              </p>
            </div>

            {/* Infinite Carousel Container */}
            <SmoothInfiniteCarousel speed={1.5} pauseOnHover={true} gap={15} className="py-4">
              {/* Cards */}
                {innovateCards.map((card, index) => (
                  <div
                    key={`card-${index}`}
                  className="flex-none w-[300px]"
                  >
                    <Link 
                      to={card.link}
                      className="bg-gray-50 p-5 h-[200px] rounded-lg shadow-sm hover:shadow-lg 
                        hover:scale-[1.02] transition-all duration-500 ease-out transform-gpu card flex flex-col justify-between"
                      style={{ 
                        willChange: 'transform, box-shadow',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div>
                        <div className="flex items-center mb-4">
                          {card.icon}
                          <h3 className="text-xl font-bold text-gray-900 ml-3">
                            {card.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {card.description}
                        </p>
                      </div>
                      <span className="inline-flex items-center text-blue-600 hover:text-blue-700 
                        transition-colors mt-4 text-sm font-medium">
                        Learn more
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                ))}
            </SmoothInfiniteCarousel>
          </div>
        </section>

        {/* 5. Client Success Stories Section - ADJUSTED SPACING */}
        <section className="pt-8 pb-12 w-[94%] mx-auto bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Client Success Stories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how we've helped innovative organizations achieve extraordinary results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudySlides[currentSlide].map((study) => (
                <div
                  key={study.id}
                  className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-[450px] object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-sm"
                    />
                  </div>

                  {/* Gradient Overlay - Lighter by default, darker on hover */}
                  <div 
                    className="absolute inset-0 bg-gradient-overlay"
                  ></div>
                  
                  {/* Industry Tag - Always Visible */}
                  <span className="absolute top-6 right-6 z-20 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                    {study.industry}
                  </span>
                  
                  <div className="relative h-[450px] p-8 flex flex-col justify-between z-20">
                    {/* Company Logo - Removed */}
                    <div>
                      {/* Logo image removed while maintaining spacing */}
                      <div className="h-12 mb-1"></div>
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-col">
                      {/* Title - Always Visible */}
                      <h3 className="text-2xl font-bold text-white mb-2 transform transition-transform duration-300 group-hover:-translate-y-2">
                        {study.title}
                      </h3>
                      
                      {/* Subtitle - Always Visible */}
                      <p className="text-blue-100 font-medium mb-3 transform transition-transform duration-300 group-hover:-translate-y-2">
                        {study.subtitle}
                      </p>
                      
                      {/* Description - Only Visible on Hover */}
                      <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-28 group-hover:opacity-100 group-hover:mb-4">
                        <p className="text-gray-200 text-sm">
                          {study.description}
                        </p>
                      </div>
                      
                      {/* Testimonial - Only Visible on Hover */}
                      <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mb-4">
                        <p className="text-gray-300 text-sm italic border-l-2 border-blue-500 pl-3">
                          "They shared our vision right from the start and helped us achieve the unthinkable through perseverance and meticulous attention to detail."
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                          <div>
                            <p className="text-white text-xs font-medium">{study.clientName || "Jane Smith"}</p>
                            <p className="text-gray-400 text-xs">{study.clientTitle || "Product Manager, " + study.title}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats - Always Visible */}
                      <div className="mb-6 transform transition-transform duration-300 group-hover:-translate-y-1">
                        <span className="text-[36px] font-bold text-white">{study.statValue || "100%"}</span>
                        <span className="text-blue-300 ml-2">{study.statLabel || "Resolution Rate"}</span>
                      </div>
                      
                      {/* Navigation Button - Changes on Hover */}
                      <Link
                        to={`/case-studies/${study.slug}`}
                        className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:rotate-[45deg]"
                        aria-label="View Case Study"
                      >
                        <ArrowRight className="text-blue-600/80 w-6 h-6 transition-all duration-300 group-hover:text-blue-600" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link 
                to="/case-studies" 
                className="group inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
              >
                View All Case Studies
                <span className="ml-2 transform transition-all duration-300 ease-in-out opacity-100 group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Seamless Salesforce Integrations Section - ADJUSTED SPACING */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Seamless Salesforce Integrations for Business Growth
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Integrate effortlessly with your favorite apps. Enhance functionality, boost efficiency,
                and streamline workflows.
              </p>
            </div>
            
            {/* Integration Logos - First Row - Increased logo sizes */}
            <div className="flex flex-wrap justify-center items-center gap-x-14 gap-y-10 mb-14">
              {/* Increased width from w-28/w-32 to w-36/w-40 */}
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/team.svg" alt="Microsoft Teams" className="h-12" />
              </div>
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/Slack.svg" alt="Slack" className="h-12" />
              </div>
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/Zapier.svg" alt="Zapier" className="h-12" />
              </div>
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/trello.svg" alt="Trello" className="h-12" />
              </div>
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/meet.svg" alt="Google Meet" className="h-12" />
              </div>
            </div>
            
            {/* Integration Logos - Second Row - Increased logo sizes */}
            <div className="flex flex-wrap justify-center items-center gap-x-14 gap-y-10">
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/Zendesk.svg" alt="Zendesk" className="h-12" />
              </div>
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/Jira.svg" alt="Jira" className="h-12" />
              </div>
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/gdrive.svg" alt="Google Drive" className="h-12" />
              </div>
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/asana.svg" alt="Asana" className="h-12" />
              </div>
              <div className="w-36 md:w-40 flex justify-center">
                <img src="/assets/intercom.svg" alt="Intercom" className="h-12" />
              </div>
            </div>
          </div>
        </section>

        {/* 7. Our Global Partnership Network Section - ADJUSTED SPACING */}
        <section className="pt-16 pb-12 w-[94%] mx-auto bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Global Partnership Network
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our industry-leading partnerships give you access to a broader range of technologies and services.
              </p>
            </div>

            {/* Partners Grid */}
            <div className="grid md:grid-cols-3 gap-10">
              {/* Salesforce */}
              <div className="text-center">
                <div className="mb-5">
                  <img 
                    src="/assets/Salesforce.svg" 
                    alt="Salesforce" 
                    className="h-16 mx-auto"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Certified Expertise
                  </h4>
                  <p className="text-gray-600">
                    Our team holds multiple certifications across all major cloud platforms
                  </p>
                </div>
              </div>

              {/* AWS */}
              <div className="text-center">
                <div className="mb-5">
                  <img 
                    src="/assets/aws.svg" 
                    alt="AWS" 
                    className="h-16 mx-auto"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Direct Support
                  </h4>
                  <p className="text-gray-600">
                    Access to premium support and resources through our partnerships
                  </p>
                </div>
              </div>

              {/* Google Cloud Platform */}
              <div className="text-center">
                <div className="mb-5">
                  <img 
                    src="/assets/google-cloud.svg" 
                    alt="Google Cloud Platform" 
                    className="h-16 mx-auto"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Best Practices
                  </h4>
                  <p className="text-gray-600">
                    Implementation following partner-approved methodologies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Why CloudSeek Section - ADJUSTED SPACING */}
        <section className="pt-8 pb-12 w-[94%] mx-auto bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Content for Why CloudSeek section */}
          </div>
        </section>

        {/* 9. Contact Form Section */}
        <section className="py-14 w-[94%] mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left Column - Text */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white mb-4">
                  Connect With Us
                </h2>
                <div className="w-24 h-1 bg-blue-600 mb-6"></div>
                <p className="text-gray-300 text-lg mb-4 pr-6">
                  Let's work together to transform your business with custom Salesforce solutions tailored to your needs.
                </p>
              </div>

              {/* Right Column - Form */}
              <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-5">
                  How can we help you?
                </h3>
                <form 
                  name="home-contact" 
                  method="POST" 
                  data-netlify="true" 
                  data-netlify-honeypot="bot-field"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const formValues: Record<string, string> = {};
                    
                    formData.forEach((value, key) => {
                      formValues[key] = value.toString();
                    });
                    
                    // Add form name
                    formValues['form-name'] = 'home-contact';
                    
                    fetch('/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      body: encode(formValues)
                    })
                    .then(() => {
                      alert('Thank you for your message! We will get back to you soon.');
                      // Reset form
                      e.currentTarget.reset();
                    })
                    .catch(error => {
                      alert('Oops! There was a problem submitting your form. Please try again later.');
                      console.error('Form submission error:', error);
                    });
                  }}
                  className="space-y-4"
                >
                  {/* Hidden input for Netlify form name */}
                  <input type="hidden" name="form-name" value="home-contact" />
                  
                  {/* Honeypot field */}
                  <p className="hidden">
                    <label>
                      Don't fill this out if you're human: 
                      <input name="bot-field" />
                    </label>
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        FULL NAME <span className="text-blue-500">*</span>
                      </label>
                      <input 
                        type="text"
                        name="fullname"
                        className="w-full bg-gray-800 border-0 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all hover:bg-gray-750"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Work Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        WORK EMAIL <span className="text-blue-500">*</span>
                      </label>
                      <input 
                        type="email"
                        name="email"
                        className="w-full bg-gray-800 border-0 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all hover:bg-gray-750"
                        placeholder="Enter your work email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        PHONE NUMBER
                      </label>
                      <input 
                        type="tel"
                        name="phone"
                        className="w-full bg-gray-800 border-0 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all hover:bg-gray-750"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Organization */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        ORGANIZATION
                      </label>
                      <input 
                        type="text"
                        name="organization"
                        className="w-full bg-gray-800 border-0 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all hover:bg-gray-750"
                        placeholder="Enter your organization"
                      />
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      PROJECT DESCRIPTION
                    </label>
                    <textarea 
                      name="project-description"
                      className="w-full bg-gray-800 border-0 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 h-24 transition-all hover:bg-gray-750"
                      placeholder="Describe your project"
                    ></textarea>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox"
                        name="subscribe-updates"
                        className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-800"
                      />
                      <span className="text-gray-400 text-sm">Check here to subscribe for updates.</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox"
                        name="sms-consent"
                        className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-800"
                      />
                      <span className="text-gray-400 text-sm">By checking this box, you agree to receive SMS messages from CloudSeek. Reply 'STOP' to opt-out at any time.</span>
                    </label>
                  </div>

                  {/* Terms and Privacy */}
                  <div className="text-xs text-gray-400">
                    By "Submitting" this form, you are agreeing to CloudSeek's{' '}
                    <a href="#" className="text-blue-500 hover:text-blue-400">terms of use</a> and{' '}
                    <a href="#" className="text-blue-500 hover:text-blue-400">privacy policy</a>. 
                    We appreciate your trust in us. Your privacy is our top priority.
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] text-base font-medium shadow-md"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Blog Section */}
        <section className="py-16 w-[94%] mx-auto bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Expert Insights & Resource Hub
              </h2>
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  to="/blog" 
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read Our Blogs <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-3 gap-7">
              {BLOG_POSTS.slice(0, 3).map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                  <div className="relative h-60 mb-7 overflow-hidden rounded-xl">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mb-2">
                    <span className="text-blue-600 text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>

            {/* Mobile - Read More Link */}
            <div className="mt-8 text-center md:hidden">
              <Link 
                to="/blog" 
                className="inline-flex items-center text-gray-900 hover:text-blue-600 transition-colors font-medium"
              >
                Read Our Blogs
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home; 