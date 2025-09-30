import React from 'react';
import { motion } from 'framer-motion';

export default function RefundPage() {
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
              Refund Policy
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  30-Day Money Back Guarantee
                </h2>
                <p>
                  We stand behind our Divine Soul Reading service with a 30-day money-back guarantee. 
                  If you are not completely satisfied with your reading, you may request a full refund 
                  within 30 days of your purchase.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Refund Process
                </h2>
                <p>To request a refund, please follow these steps:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact our customer support team at support@holymind.life</li>
                  <li>Include your order number and reason for the refund request</li>
                  <li>Allow 3-5 business days for processing</li>
                  <li>Refunds will be issued to the original payment method</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Refund Conditions
                </h2>
                <p>Please note the following conditions for refunds:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refund requests must be made within 30 days of purchase</li>
                  <li>Digital products are eligible for refund if not accessed or downloaded</li>
                  <li>Personalized readings that have been delivered are subject to review</li>
                  <li>Processing fees may apply for certain payment methods</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <p>
                  For any questions regarding refunds or our policy, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> support@holymind.life</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                  <p><strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Dispute Resolution
                </h2>
                <p>
                  If you have any concerns about your purchase that cannot be resolved through 
                  our standard refund process, we are committed to working with you to find a 
                  satisfactory solution. We believe in fair and transparent business practices.
                </p>
              </section>

              <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Last Updated:</strong> January 2025<br/>
                  This refund policy is subject to change. Any updates will be posted on this page.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}