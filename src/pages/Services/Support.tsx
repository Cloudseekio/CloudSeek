import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Shield, Headset, BarChart2, Users, Zap, ArrowRight, MessageSquare, LifeBuoy } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Expert Salesforce Technical Support</h1>
              <p className="text-xl text-blue-100 mb-8">
                Reliable, responsive support to keep your Salesforce implementation running smoothly and efficiently.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#support-plans" 
                  className="bg-white text-blue-700 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  View Support Plans
                </a>
                <Link 
                  to="/contact" 
                  className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/services/support-hero.jpg" 
                alt="Salesforce Technical Support" 
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://via.placeholder.com/600x400/1a365d/ffffff?text=Technical+Support';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Plans */}
      <section id="support-plans" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Support Plans That Scale With You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the level of support that fits your organization's needs and Salesforce complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Essential Support */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-8">
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <LifeBuoy className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Essential Support</h3>
              <p className="text-gray-600 mb-6">
                Standard support for organizations with basic Salesforce needs.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email support during business hours</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>48-hour response time</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Knowledge base access</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Business hours
                </span>
                <Link to="/contact?plan=essential" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Plan 2: Premium Support */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-8 transform md:scale-105 relative z-10">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-semibold">
                POPULAR
              </div>
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Support</h3>
              <p className="text-gray-600 mb-6">
                Enhanced support for growing organizations with complex Salesforce implementations.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email and phone support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>24-hour response time</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated support manager</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Monthly system health check</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Extended hours
                </span>
                <Link to="/contact?plan=premium" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Plan 3: Enterprise Support */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-8">
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Headset className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Enterprise Support</h3>
              <p className="text-gray-600 mb-6">
                Premium support for large organizations with mission-critical Salesforce deployments.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>24/7 priority support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>4-hour response for critical issues</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated technical account manager</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Quarterly system reviews</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Proactive monitoring</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> 24/7/365
                </span>
                <Link to="/contact?plan=enterprise" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Support Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our technical support goes beyond just fixing problems – we help you optimize and evolve your Salesforce implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Issue Resolution</h3>
              <p className="text-gray-600">
                Fast, expert troubleshooting for any Salesforce issues, from simple errors to complex configuration problems.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <BarChart2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Optimization</h3>
              <p className="text-gray-600">
                Identify and resolve performance bottlenecks to ensure your Salesforce org runs efficiently.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security Monitoring</h3>
              <p className="text-gray-600">
                Regular security reviews and recommendations to protect your Salesforce data and ensure compliance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User Management</h3>
              <p className="text-gray-600">
                Assistance with user creation, permission sets, profiles, and access control to maintain proper security.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Release Management</h3>
              <p className="text-gray-600">
                Guidance on upcoming Salesforce releases and help implementing new features that benefit your business.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <LifeBuoy className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Knowledge Transfer</h3>
              <p className="text-gray-600">
                Equip your team with the knowledge they need to handle common issues and maximize your Salesforce investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Support Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined, effective approach to resolving your Salesforce challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Issue Submission</h3>
              <p className="text-gray-600">
                Submit your support request through our portal, email, or phone depending on your support plan.
              </p>
              {/* Right arrow for desktop */}
              <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                <ArrowRight className="h-8 w-8 text-gray-300" />
              </div>
              {/* Down arrow for mobile */}
              <div className="md:hidden mx-auto mt-4 mb-4">
                <svg className="h-8 w-8 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <div className="text-center relative">
              <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Triage & Assignment</h3>
              <p className="text-gray-600">
                Your issue is prioritized and assigned to the most qualified support specialist for your needs.
              </p>
              {/* Right arrow for desktop */}
              <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                <ArrowRight className="h-8 w-8 text-gray-300" />
              </div>
              {/* Down arrow for mobile */}
              <div className="md:hidden mx-auto mt-4 mb-4">
                <svg className="h-8 w-8 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <div className="text-center relative">
              <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resolution</h3>
              <p className="text-gray-600">
                Our experts work on your issue, keeping you updated throughout the process until it's resolved.
              </p>
              {/* Right arrow for desktop */}
              <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                <ArrowRight className="h-8 w-8 text-gray-300" />
              </div>
              {/* Down arrow for mobile */}
              <div className="md:hidden mx-auto mt-4 mb-4">
                <svg className="h-8 w-8 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Follow-up & Documentation</h3>
              <p className="text-gray-600">
                We ensure you're satisfied with the solution and document it for future reference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from organizations that rely on our technical support services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "When we experienced a critical issue during our busiest season, CloudSeek's team resolved it within hours. Their technical expertise saved us from a potentially costly situation."
              </p>
              <div>
                <p className="font-bold text-gray-900">Richard M.</p>
                <p className="text-gray-600 text-sm">CIO, Global Retail Solutions</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The Premium Support plan has been invaluable to our team. Our dedicated support manager understands our business and consistently provides solutions that improve our workflow."
              </p>
              <div>
                <p className="font-bold text-gray-900">Sarah J.</p>
                <p className="text-gray-600 text-sm">Operations Director, FinTech Innovations</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "I appreciate how CloudSeek doesn't just fix our issues—they teach us how to prevent them. Their knowledge transfer has been instrumental in building our internal capabilities."
              </p>
              <div>
                <p className="font-bold text-gray-900">Amanda L.</p>
                <p className="text-gray-600 text-sm">Salesforce Admin, HealthCare Systems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get the Support You Need?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Contact us today to discuss how our technical support services can keep your Salesforce implementation operating at peak efficiency.
          </p>
          <Link 
            to="/contact?source=support" 
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            Contact Support Team <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Support; 