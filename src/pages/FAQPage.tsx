import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SEO from '../components/SEO';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
}

// Create an array of FAQ items for both display and SEO schema
const faqData = {
  general: [
    {
      question: "What is CloudSeek?",
      answer: "CloudSeek is a leading Salesforce implementation partner specializing in helping businesses leverage the full power of Salesforce to transform their operations, enhance customer relationships, and drive growth. We provide end-to-end services from strategy and implementation to support and optimization."
    },
    {
      question: "Where is CloudSeek located?",
      answer: "CloudSeek's headquarters is located in North Carolina, United States. We also have regional offices in Dubai, UAE and Lahore, Pakistan, allowing us to serve clients globally."
    },
    {
      question: "What industries does CloudSeek specialize in?",
      answer: "We have expertise across multiple industries including Real Estate, Financial Services, Healthcare, Retail, Manufacturing, Technology, and Professional Services. Our team's diverse experience allows us to understand the unique challenges and requirements of each industry."
    },
    {
      question: "How long has CloudSeek been in business?",
      answer: "CloudSeek was founded in 2015 and has been helping businesses transform with Salesforce solutions for over 8 years. During this time, we've successfully completed hundreds of implementations and built a reputation for excellence and innovation."
    }
  ],
  services: [
    {
      question: "What Salesforce services does CloudSeek offer?",
      answer: "We provide a comprehensive range of Salesforce services including Implementation, Custom Development, Consulting, Migration and Integration, Training, Ongoing Support and Optimization, and Salesforce Health Checks."
    },
    {
      question: "Which Salesforce clouds do you implement?",
      answer: "We have certified experts in all major Salesforce clouds including Sales Cloud, Service Cloud, Marketing Cloud, Experience Cloud, Commerce Cloud, Einstein Analytics, Pardot, and CPQ."
    },
    {
      question: "Do you provide custom Salesforce development?",
      answer: "Yes, we specialize in custom Salesforce development to address unique business requirements. Our expert developers can create custom applications, Lightning components, Apex triggers, Visualforce pages, and integration solutions tailored to your specific needs."
    },
    {
      question: "Can you integrate Salesforce with other systems?",
      answer: "Absolutely. We have extensive experience integrating Salesforce with various third-party applications and systems including ERP systems, marketing platforms, financial software, eCommerce platforms, and custom legacy systems."
    }
  ],
  implementation: [
    {
      question: "What does a typical Salesforce implementation process look like?",
      answer: "Our implementation methodology follows these key phases: Discovery & Strategy, Solution Design, Configuration & Development, Data Migration, Integration, Testing, Training, and Go-Live & Support."
    },
    {
      question: "How long does a Salesforce implementation typically take?",
      answer: "Implementation timelines vary based on the complexity, scope, and specific requirements of your project. A simple implementation might take 4-8 weeks, while more complex enterprise-wide implementations can take 3-6 months or longer."
    },
    {
      question: "Do you provide training during implementation?",
      answer: "Yes, training is a critical component of our implementation process. We provide custom training sessions for administrators, end-users, and other stakeholders to ensure everyone knows how to use the system effectively."
    },
    {
      question: "What happens after the implementation is complete?",
      answer: "After go-live, we provide post-implementation support to address any issues that may arise. We also offer ongoing managed services, regular health checks, and continuous optimization."
    }
  ],
  // Additional categories...
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <button
        className="flex w-full justify-between items-center text-left focus:outline-none"
        onClick={toggleOpen}
      >
        <h3 className="text-xl font-semibold text-gray-900">{question}</h3>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-6 w-6 text-blue-500" />
          ) : (
            <ChevronDown className="h-6 w-6 text-blue-500" />
          )}
        </span>
      </button>
      <div
        className={`mt-3 pr-12 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-base text-gray-600">{answer}</div>
      </div>
    </div>
  );
};

const FAQPage: React.FC = () => {
  // State to track which FAQ items are open
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({
    'general-0': true, // Open the first item by default
  });

  // Toggle function to handle opening/closing FAQ items
  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Prepare FAQ items for schema.org (convert from nested structure to flat array)
  const getAllFaqItems = () => {
    const allItems: { question: string; answer: string }[] = [];
    
    Object.values(faqData).forEach(category => {
      category.forEach(item => {
        // Convert React nodes to string if needed
        const answerText = typeof item.answer === 'string' 
          ? item.answer 
          : 'Please visit our website for a detailed answer.';
          
        allItems.push({
          question: item.question,
          answer: answerText
        });
      });
    });
    
    return allItems;
  };

  return (
    <>
      {/* SEO Component with FAQ Schema */}
      <SEO
        title="Frequently Asked Questions | CloudSeek"
        description="Find answers to common questions about Salesforce implementation, customization, and our services at CloudSeek."
        canonical="/faq"
        image="/images/faq-banner.jpg"
        type="faq"
        faqItems={getAllFaqItems()}
      />
      
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              Can't find the answer you're looking for? Reach out to our{' '}
              <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
                customer support
              </a>{' '}
              team.
            </p>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                General Questions
              </h2>
              <div className="space-y-0">
                {faqData.general.map((item, index) => (
                  <FAQItem
                    key={`general-${index}`}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItems[`general-${index}`] || false}
                    toggleOpen={() => toggleItem('general', index)}
                  />
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-16 mb-8">
                Salesforce Services
              </h2>
              <div className="space-y-0">
                {faqData.services.map((item, index) => (
                  <FAQItem
                    key={`services-${index}`}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItems[`services-${index}`] || false}
                    toggleOpen={() => toggleItem('services', index)}
                  />
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-16 mb-8">
                Implementation Process
              </h2>
              <div className="space-y-0">
                {faqData.implementation.map((item, index) => (
                  <FAQItem
                    key={`implementation-${index}`}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItems[`implementation-${index}`] || false}
                    toggleOpen={() => toggleItem('implementation', index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage; 