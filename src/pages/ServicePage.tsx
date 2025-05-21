import React from 'react';
import SEO from '../components/SEO';

const ServicePage: React.FC = () => {
  // Service details for schema.org
  const serviceDetails = {
    name: "Salesforce Implementation Services",
    description: "Complete Salesforce implementation services tailored to your business needs, from initial setup to complex customizations and integrations.",
    provider: "CloudSeek",
    areaServed: "Global",
    serviceType: "Salesforce Implementation",
    image: "/images/services/implementation.jpg"
  };

  return (
    <>
      {/* SEO Component with Service Schema */}
      <SEO
        title="Salesforce Implementation Services | CloudSeek"
        description="Enterprise-grade Salesforce implementation services tailored to your business needs, providing full CRM configuration, customization, and integration."
        canonical="/services/salesforce-implementation"
        image="/images/services/implementation-hero.jpg"
        type="service"
        serviceDetails={serviceDetails}
      />
      
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Salesforce Implementation Services
            </h1>
            
            <div className="mt-8 prose prose-blue prose-lg text-gray-500 mx-auto">
              <p className="lead">
                Transform your business with our comprehensive Salesforce implementation services. 
                We'll help you harness the full power of Salesforce to streamline operations, enhance 
                customer relationships, and drive growth.
              </p>
              
              <h2>Our Implementation Process</h2>
              <p>
                At CloudSeek, we follow a proven implementation methodology that ensures success:
              </p>
              
              <ol>
                <li>
                  <strong>Discovery & Strategy</strong> - We begin by understanding your business goals, 
                  processes, and requirements to create a tailored implementation plan.
                </li>
                <li>
                  <strong>Solution Design</strong> - Our experts design a Salesforce solution that aligns 
                  with your business processes and objectives.
                </li>
                <li>
                  <strong>Configuration & Development</strong> - We configure Salesforce to match your 
                  requirements and develop custom features as needed.
                </li>
                <li>
                  <strong>Data Migration</strong> - We safely migrate your data from existing systems to 
                  Salesforce, ensuring data integrity.
                </li>
                <li>
                  <strong>Integration</strong> - We integrate Salesforce with your other business systems 
                  for seamless data flow.
                </li>
                <li>
                  <strong>Testing</strong> - Thorough testing ensures everything works as expected before 
                  going live.
                </li>
                <li>
                  <strong>Training</strong> - We provide comprehensive training to ensure your team can 
                  effectively use the system.
                </li>
                <li>
                  <strong>Go-Live & Support</strong> - Our team provides support during and after 
                  launch to ensure a smooth transition.
                </li>
              </ol>
              
              <h2>Why Choose CloudSeek for Salesforce Implementation?</h2>
              <ul>
                <li>Certified Salesforce experts with years of implementation experience</li>
                <li>Industry-specific expertise across multiple sectors</li>
                <li>Custom approach tailored to your unique business needs</li>
                <li>Commitment to on-time, on-budget delivery</li>
                <li>Ongoing support and optimization services</li>
                <li>High client satisfaction and retention rates</li>
              </ul>
              
              <div className="mt-8">
                <h2>Ready to Get Started?</h2>
                <p>
                  Contact us today to discuss your Salesforce implementation needs and discover 
                  how we can help transform your business.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Request a Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePage; 