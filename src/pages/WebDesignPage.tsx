import React from 'react';
import { ChevronRight, CheckCircle, Monitor, Smartphone, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

const WebDesignPage: React.FC = () => {
  // Example portfolio projects
  const portfolioProjects = [
    {
      title: "NexGen Financial Dashboard",
      type: "Web Application",
      description: "Modern financial dashboard with data visualization and real-time analytics",
      image: "/images/portfolio/financial-dashboard.jpg"
    },
    {
      title: "EcoLife Mobile App",
      type: "Mobile Application",
      description: "Sustainability tracking app with gamification and social features",
      image: "/images/portfolio/ecolife-app.jpg"
    },
    {
      title: "MediConnect Portal",
      type: "Healthcare Platform",
      description: "Patient-doctor communication platform with appointment scheduling and secure messaging",
      image: "/images/portfolio/healthcare-portal.jpg"
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
                Stunning Web & Interface Design That Inspires Action
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Beautiful, intuitive, and conversion-focused digital experiences that elevate your brand and drive results.
              </p>
              <Link 
                to="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-block"
              >
                Start Your Design Project
              </Link>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img 
                src="/images/web-design-hero.jpg" 
                alt="Web Design Showcase" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Design Services That Transform Your Digital Presence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We create compelling visual experiences that engage your audience and strengthen your brand
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Monitor size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Website Design
              </h3>
              <p className="text-gray-600">
                Beautiful, responsive websites that captivate visitors and drive conversions with intuitive navigation and compelling visuals.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Smartphone size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Mobile App UI/UX
              </h3>
              <p className="text-gray-600">
                Seamless, engaging mobile experiences that delight users with intuitive interactions and pixel-perfect interfaces.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <LayoutGrid size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dashboard & Interface Design
              </h3>
              <p className="text-gray-600">
                Intuitive data visualizations and control interfaces that make complex information accessible and actionable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Design Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Design Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A transparent, collaborative approach that delivers exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600">
                We dive deep into your business goals, target audience, and competitive landscape to inform our design approach.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Strategy & Wireframing</h3>
              <p className="text-gray-600">
                We define user flows and create wireframes to establish the structure and functionality of your digital experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visual Design</h3>
              <p className="text-gray-600">
                We craft beautiful, branded visuals that bring the wireframes to life and engage your target audience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Handoff & Support</h3>
              <p className="text-gray-600">
                We deliver finalized designs with comprehensive documentation and support the development process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Design Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A selection of our recent design work across various industries and platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-blue-600 text-sm font-semibold">{project.type}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <a href="#" className="text-blue-600 font-medium flex items-center">
                    View Case Study <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Design Approach Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Design Approach
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We blend aesthetics with functionality to create digital experiences that delight users and drive business results.
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">User-Centered Design</h3>
                    <p className="text-gray-600">We design with your users in mind, creating intuitive experiences that solve real problems.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Responsive & Accessible</h3>
                    <p className="text-gray-600">Our designs work beautifully across all devices and are accessible to all users.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Conversion-Focused</h3>
                    <p className="text-gray-600">Our designs guide users toward key actions that drive your business objectives.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Brand Consistency</h3>
                    <p className="text-gray-600">We ensure your digital presence reinforces your brand identity at every touchpoint.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Data-Informed Decisions</h3>
                    <p className="text-gray-600">We leverage analytics and user testing to validate and refine our design solutions.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img 
                src="/images/design-approach.jpg" 
                alt="Our Design Approach" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonial Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-10 md:p-16">
                <div className="text-blue-100 mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="feather feather-message-circle"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  The CloudSeek team transformed our digital presence with a stunning website that perfectly captures our brand essence while driving measurable business results.
                </h3>
                <div className="flex items-center">
                  <img 
                    src="/images/client-avatar.jpg" 
                    alt="Client" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="text-white font-bold">Sarah Johnson</p>
                    <p className="text-blue-100">Marketing Director, TechInnovate</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/images/design-testimonial.jpg" 
                  alt="Project Screenshot" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Digital Experience?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Let's discuss how our design services can help you create beautiful, effective digital experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Start Your Project
            </Link>
            <Link 
              to="/case-studies" 
              className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              View Our Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebDesignPage; 