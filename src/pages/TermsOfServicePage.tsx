import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsOfServicePage: React.FC = () => {
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
        <title>Terms of Service | CloudSeek</title>
        <meta name="description" content="CloudSeek's Terms of Service - The terms and conditions that govern your use of our website and services." />
      </Helmet>

      <div className="py-12 bg-[#0f1628] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Terms of Service</h1>
          <p className="mt-4 text-center text-blue-200">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600">
            Please read these terms of service ("terms", "terms of service") carefully before using the CloudSeek website ("website", "service") operated by CloudSeek ("us", "we", "our").
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Conditions of Use</h2>
          <p className="text-gray-600">
            By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website. CloudSeek only grants use and access of this website to those who have accepted its terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Privacy Policy</h2>
          <p className="text-gray-600">
            Before you continue using our website, we advise you to read our <a href="/privacy-policy" className="text-blue-600 hover:underline">privacy policy</a> regarding our user data collection. It will help you better understand our practices.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Intellectual Property</h2>
          <p className="text-gray-600">
            You agree that all materials, products, and services provided on this website are the property of CloudSeek, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property. You agree that you will not reproduce or redistribute the CloudSeek's intellectual property in any way, including electronic, digital, or new trademark registrations.
          </p>
          <p className="text-gray-600">
            You grant CloudSeek a royalty-free and non-exclusive license to display, use, copy, transmit, and broadcast the content you upload and publish. For issues regarding intellectual property claims, you should contact the company in order to come to an agreement.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">4. User Accounts</h2>
          <p className="text-gray-600">
            As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information. You are also responsible for all activities that occur under your account or password.
          </p>
          <p className="text-gray-600">
            If you think there are any possible issues regarding the security of your account on the website, inform us immediately so we may address them accordingly.
          </p>
          <p className="text-gray-600">
            We reserve all rights to terminate accounts, edit or remove content and cancel orders at our sole discretion.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Applicable Law</h2>
          <p className="text-gray-600">
            By visiting this website, you agree that the laws of the United States, without regard to principles of conflict laws, will govern these terms of service, or any dispute of any sort that might come between CloudSeek and you, or its business partners and associates.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Disputes</h2>
          <p className="text-gray-600">
            Any dispute related in any way to your visit to this website or to products you purchase from us shall be arbitrated by state or federal court in North Carolina, United States and you consent to exclusive jurisdiction and venue of such courts.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">7. Indemnification</h2>
          <p className="text-gray-600">
            You agree to indemnify CloudSeek and its affiliates and hold CloudSeek harmless against legal claims and demands that may arise from your use or misuse of our services. We reserve the right to select our own legal counsel.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">8. Limitation on Liability</h2>
          <p className="text-gray-600">
            CloudSeek is not liable for any damages that may occur to you as a result of your misuse of our website. CloudSeek reserves the right to edit, modify, and change this Agreement at any time. We shall let our users know of these changes through electronic mail. This Agreement is an understanding between CloudSeek and the user, and this supersedes and replaces all prior agreements regarding the use of this website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">9. Services and Products</h2>
          <p className="text-gray-600">
            The services and products offered by CloudSeek include Salesforce implementation, consulting, integration, custom development, training, and support services. All services are subject to the specific terms agreed upon in separate service agreements or statements of work.
          </p>
          <p className="text-gray-600">
            We strive to describe our services as accurately as possible, but we do not warrant that the descriptions are accurate, complete, reliable, current, or error-free. If a service is not as described, your sole remedy is to terminate the service agreement as specified therein.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">10. Changes to Terms</h2>
          <p className="text-gray-600">
            CloudSeek reserves the right, in its sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p className="text-gray-600">
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">11. Contact Information</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms, please contact us at:<br />
            CloudSeek<br />
            75 Technology Drive, Suite 300, North Carolina, United States<br />
            Email: legal@cloudseek.io
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 