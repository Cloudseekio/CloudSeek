import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Linkedin, MessageSquare } from 'lucide-react';
import PageHeader from '../components/PageHeader';

// Helper function to encode form data for Netlify Forms
const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    'bot-field': ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'contact',
        ...formData
      })
    })
    .then(() => {
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Thank you! Your message has been received. We will get back to you shortly.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        'bot-field': ''
      });
    })
    .catch(error => {
      setFormStatus({
        submitted: false,
        error: true,
        message: 'Oops! There was an error submitting the form. Please try again later.'
      });
      console.error('Form submission error:', error);
    });
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch with our team of cloud experts"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            
            {formStatus.submitted && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
                <p>{formStatus.message}</p>
              </div>
            )}
            
            {formStatus.error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
                <p>{formStatus.message}</p>
              </div>
            )}
            
            <form 
              name="contact" 
              method="POST" 
              data-netlify="true" 
              data-netlify-honeypot="bot-field" 
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {/* Hidden input for Netlify form name */}
              <input type="hidden" name="form-name" value="contact" />
              
              {/* Honeypot field */}
              <p className="hidden">
                <label>
                  Don't fill this out if you're human: <input name="bot-field" value={formData['bot-field']} onChange={handleChange} />
                </label>
              </p>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message*
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Head Office */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Headquarters</h3>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    75 Technology Drive, Suite 300<br />
                    North Carolina, United States
                  </span>
                </div>
              </div>
              
              {/* Contact Methods */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href="mailto:info@cloudseek.io" className="ml-3 text-lg text-gray-700 hover:text-blue-600 transition-colors">
                    info@cloudseek.io
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href="mailto:sales@cloudseek.io" className="ml-3 text-lg text-gray-700 hover:text-blue-600 transition-colors">
                    sales@cloudseek.io
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href="mailto:support@cloudseek.io" className="ml-3 text-lg text-gray-700 hover:text-blue-600 transition-colors">
                    support@cloudseek.io
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href="tel:+1-800-CLOUDSEEK" className="ml-3 text-lg text-gray-700 hover:text-blue-600 transition-colors">
                    +1-800-CLOUDSEEK
                  </a>
                </div>
              </div>
              
              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="https://linkedin.com/company/cloudseek" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              {/* Support Hours */}
              <div className="bg-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Support Hours</h3>
                <p className="mb-2">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                <p>Enterprise customers: 24/7 support available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 