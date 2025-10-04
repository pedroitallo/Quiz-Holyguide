import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Information We Collect
                </h2>
                <p>
                  We collect information you provide directly to us, such as when you create 
                  an account, request a reading, or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal information (name, email address, date of birth)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communication preferences and reading history</li>
                  <li>Technical information (IP address, browser type, device information)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide personalized spiritual readings and guidance</li>
                  <li>Process payments and manage your account</li>
                  <li>Communicate with you about our services</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Information Sharing and Disclosure
                </h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to 
                  third parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With service providers who assist in operating our website</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Data Security
                </h2>
                <p>
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Cookies and Tracking Technologies
                </h2>
                <p>
                  We use cookies and similar technologies to enhance your experience on our 
                  website. These technologies help us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve our services and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Your Rights and Choices
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Disable cookies in your browser settings</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Third-Party Services
                </h2>
                <p>
                  Our website may contain links to third-party websites or integrate with 
                  third-party services. We are not responsible for the privacy practices of 
                  these external sites. We encourage you to review their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Children's Privacy
                </h2>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-800">
                    <strong>Important:</strong> Our services are not intended for children under 
                    18 years of age. We do not knowingly collect personal information from children 
                    under 18. If you are under 18, please do not use our services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. International Data Transfers
                </h2>
                <p>
                  Your information may be transferred to and processed in countries other than 
                  your own. We ensure appropriate safeguards are in place to protect your data 
                  in accordance with applicable privacy laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of 
                  any changes by posting the new policy on this page and updating the "Last 
                  Updated" date below.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> privacy@holymind.life</p>
                  <p><strong>Website:</strong> https://quiz.holymind.life</p>
                  <p><strong>Response Time:</strong> Within 48 hours</p>
                </div>
              </section>

              <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Last Updated:</strong> January 2025<br/>
                  This privacy policy is subject to change. Please review periodically for updates.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}