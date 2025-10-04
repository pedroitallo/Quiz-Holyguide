import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using the Holy Mind website and services, you accept and agree 
                  to be bound by the terms and provision of this agreement. If you do not agree 
                  to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Service Description
                </h2>
                <p>
                  Holy Mind provides spiritual guidance, psychic readings, and divine soul 
                  consultations for entertainment and personal insight purposes. Our services 
                  include but are not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Divine Soul Readings</li>
                  <li>Soulmate Compatibility Analysis</li>
                  <li>Spiritual Guidance Sessions</li>
                  <li>Personalized Astrological Insights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. User Responsibilities
                </h2>
                <p>As a user of our services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and truthful information</li>
                  <li>Use our services for lawful purposes only</li>
                  <li>Respect the intellectual property rights of Holy Mind</li>
                  <li>Not share your account credentials with others</li>
                  <li>Not attempt to reverse engineer or copy our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Payment and Billing
                </h2>
                <p>
                  Payment for services is due at the time of purchase. We accept major credit 
                  cards and other payment methods as displayed on our website. All prices are 
                  in USD unless otherwise specified.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Disclaimer
                </h2>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">
                    <strong>Important:</strong> Our services are provided for entertainment and 
                    personal insight purposes only. Readings and spiritual guidance should not 
                    be used as a substitute for professional advice in legal, medical, financial, 
                    or psychological matters.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Limitation of Liability
                </h2>
                <p>
                  Holy Mind shall not be liable for any direct, indirect, incidental, special, 
                  or consequential damages resulting from the use or inability to use our services, 
                  even if we have been advised of the possibility of such damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Privacy and Data Protection
                </h2>
                <p>
                  We are committed to protecting your privacy. Please review our Privacy Policy 
                  to understand how we collect, use, and protect your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Modifications to Terms
                </h2>
                <p>
                  Holy Mind reserves the right to modify these terms at any time. Changes will 
                  be effective immediately upon posting on this website. Your continued use of 
                  our services constitutes acceptance of any modifications.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Termination
                </h2>
                <p>
                  We reserve the right to terminate or suspend your access to our services at 
                  any time, without prior notice, for conduct that we believe violates these 
                  terms or is harmful to other users or our business.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Contact Information
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> legal@holymind.life</p>
                  <p><strong>Website:</strong> https://quiz.holymind.life</p>
                </div>
              </section>

              <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Last Updated:</strong> January 2025<br/>
                  These terms are subject to change. Please review periodically for updates.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}