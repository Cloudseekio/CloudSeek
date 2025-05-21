import React from 'react';
import { Helmet } from 'react-helmet-async';
import CookieConsentSection from '../components/CookieConsentSection';

const PrivacyPolicyPage: React.FC = () => {
  // Function to format dates - last updated date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Last updated date
  const lastUpdated = formatDate(new Date(2023, 9, 15)); // October 15, 2023

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy | CloudSeek</title>
        <meta name="description" content="CloudSeek's Privacy Policy - Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="py-12 bg-[#0f1628] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Privacy Policy</h1>
          <p className="mt-4 text-center text-blue-200">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600">
            At CloudSeek, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Important Information and Who We Are</h2>
          <h3 className="text-xl font-bold text-gray-900 mt-6">Purpose of This Privacy Policy</h3>
          <p className="text-gray-600">
            This privacy policy aims to give you information on how CloudSeek collects and processes your personal data through your use of this website, including any data you may provide through this website when you sign up for our newsletter, request a demo, or contact us.
          </p>
          <p className="text-gray-600">
            This website is not intended for children and we do not knowingly collect data relating to children.
          </p>
          <p className="text-gray-600">
            It is important that you read this privacy policy together with any other privacy notice or fair processing notice we may provide on specific occasions when we are collecting or processing personal data about you so that you are fully aware of how and why we are using your data.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6">Controller</h3>
          <p className="text-gray-600">
            CloudSeek is the controller and responsible for your personal data (collectively referred to as "CloudSeek", "we", "us" or "our" in this privacy policy).
          </p>
          <p className="text-gray-600">
            We have appointed a data protection officer (DPO) who is responsible for overseeing questions in relation to this privacy policy. If you have any questions about this privacy policy, including any requests to exercise your legal rights, please contact the DPO using the details set out below.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6">Contact Details</h3>
          <p className="text-gray-600">
            Our full details are:<br />
            CloudSeek<br />
            75 Technology Drive, Suite 300, North Carolina, United States<br />
            Email address: privacy@cloudseek.io
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">2. The Data We Collect About You</h2>
          <p className="text-gray-600">
            Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
          </p>
          <p className="text-gray-600">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, title.</li>
            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
            <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">3. How We Collect Your Personal Data</h2>
          <p className="text-gray-600">
            We use different methods to collect data from and about you including through:
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>
              <strong>Direct interactions.</strong> You may give us your Identity and Contact Data by filling in forms or by corresponding with us by post, phone, email or otherwise. This includes personal data you provide when you:
              <ul className="list-disc pl-5">
                <li>Request a demo or consultation;</li>
                <li>Subscribe to our newsletter or publications;</li>
                <li>Request marketing to be sent to you;</li>
                <li>Enter a promotion or survey; or</li>
                <li>Give us feedback or contact us.</li>
              </ul>
            </li>
            <li>
              <strong>Automated technologies or interactions.</strong> As you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this personal data by using cookies, server logs and other similar technologies.
            </li>
            <li>
              <strong>Third parties or publicly available sources.</strong> We may receive personal data about you from various third parties and public sources.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">4. How We Use Your Personal Data</h2>
          <p className="text-gray-600">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Data Security</h2>
          <p className="text-gray-600">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
          </p>
          <p className="text-gray-600">
            We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Cookie Policy</h2>
          <p className="text-gray-600">
            Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
          </p>
          
          <h3 className="text-xl font-bold text-gray-900 mt-6">What Are Cookies</h3>
          <p className="text-gray-600">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site. Cookies can be "persistent" or "session" cookies.
          </p>
          
          <h3 className="text-xl font-bold text-gray-900 mt-6">How We Use Cookies</h3>
          <p className="text-gray-600">
            We use the following types of cookies:
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li><strong>Strictly Necessary Cookies:</strong> These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website.</li>
            <li><strong>Analytical/Performance Cookies:</strong> These allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.</li>
            <li><strong>Functionality Cookies:</strong> These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences.</li>
            <li><strong>Targeting Cookies:</strong> These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests.</li>
          </ul>
          
          <h3 className="text-xl font-bold text-gray-900 mt-6">Your Cookie Preferences</h3>
          <p className="text-gray-600">
            You can manage your cookie preferences by using the settings panel below. Note that disabling certain cookies may impact how our website functions.
          </p>
          
          {/* Cookie Consent Management Component */}
          <CookieConsentSection />
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">7. Your Legal Rights</h2>
          <p className="text-gray-600">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
          <p className="text-gray-600 mt-4">
            If you wish to exercise any of the rights set out above, please contact our DPO at privacy@cloudseek.io.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">8. Changes to the Privacy Policy</h2>
          <p className="text-gray-600">
            We keep our privacy policy under regular review. This version was last updated on {lastUpdated}. Historic versions can be obtained by contacting us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 