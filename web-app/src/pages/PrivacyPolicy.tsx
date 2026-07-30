/**
 * Privacy Policy Page
 */

import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">📄</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SafeDoc AI
            </span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to SafeDoc AI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our document automation platform.
            </p>
            <p className="text-gray-700">
              By using SafeDoc AI, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we don't store credit card details)</li>
              <li><strong>Document Content:</strong> Text and data you input into generated documents</li>
              <li><strong>Company Information:</strong> Business name, logo, contact details (optional)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies:</strong> Session cookies for authentication and preferences</li>
              <li><strong>Analytics:</strong> Aggregated usage statistics (no personal identification)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 OAuth Authentication</h3>
            <p className="text-gray-700 mb-4">
              When you sign in with Google, GitHub, or Apple, we receive your email address, name, and profile picture. We do not store or access your third-party account passwords.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Provide and maintain the SafeDoc AI service</li>
              <li>Generate and process your documents using AI</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send transactional emails (document confirmations, receipts)</li>
              <li>Improve our services through usage analytics</li>
              <li>Provide customer support</li>
              <li>Detect and prevent fraud or security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">We Share Your Data With:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> Google Gemini (AI processing), Stripe (payments), Pusher (real-time updates)</li>
              <li><strong>Cloud Infrastructure:</strong> Vercel (hosting), Railway (backend), AWS (if applicable)</li>
              <li><strong>Email Services:</strong> Gmail API (if you enable auto-send)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">We Do NOT:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Sell your personal information to third parties</li>
              <li>Share your documents with other users</li>
              <li>Use your data to train AI models for other customers</li>
              <li>Send marketing emails without your consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Encryption:</strong> TLS/SSL for data in transit, bcrypt for passwords</li>
              <li><strong>Authentication:</strong> JWT tokens with 7-day expiration</li>
              <li><strong>Access Control:</strong> Role-based permissions, secure API endpoints</li>
              <li><strong>Infrastructure:</strong> Hosted on secure cloud platforms (Vercel, Railway)</li>
              <li><strong>Monitoring:</strong> Real-time security alerts and logging</li>
            </ul>
            <p className="text-gray-700">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Documents:</strong> Stored indefinitely unless you delete them</li>
              <li><strong>Billing Records:</strong> Kept for 7 years (legal requirement)</li>
              <li><strong>Usage Logs:</strong> Retained for 90 days, then aggregated/anonymized</li>
            </ul>
            <p className="text-gray-700">
              You can delete your account and all associated data at any time from your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights (GDPR, CCPA)</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Opt out of certain data processing activities</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, contact us at <a href="mailto:privacy@safedoc.ai" className="text-blue-600 hover:underline">privacy@safedoc.ai</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Essential:</strong> Authentication, session management (required)</li>
              <li><strong>Analytics:</strong> Usage statistics, feature adoption (optional)</li>
              <li><strong>Preferences:</strong> Theme, language, UI settings (optional)</li>
            </ul>
            <p className="text-gray-700">
              You can disable non-essential cookies in your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700">
              SafeDoc AI is not intended for users under 18 years old. We do not knowingly collect data from children. If we discover we have collected data from a child, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700">
              Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place (Standard Contractual Clauses, adequacy decisions) to protect your data in compliance with GDPR and other regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our data practices, contact us:
            </p>
            <ul className="list-none mb-4 text-gray-700 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:privacy@safedoc.ai" className="text-blue-600 hover:underline">privacy@safedoc.ai</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@safedoc.ai" className="text-blue-600 hover:underline">support@safedoc.ai</a></li>
              <li><strong>Website:</strong> <a href="https://safedoc.ai" className="text-blue-600 hover:underline">https://safedoc.ai</a></li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Made with 💙 by <a href="https://toolsetlabs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Toolset</a>
          </p>
          <p className="mt-2">
            <Link to="/terms" className="text-gray-600 hover:text-gray-900 mx-2">Terms of Service</Link>
            <span className="text-gray-400">|</span>
            <Link to="/" className="text-gray-600 hover:text-gray-900 mx-2">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
