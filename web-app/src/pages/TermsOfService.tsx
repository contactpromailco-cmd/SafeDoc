/**
 * Terms of Service Page
 */

import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using SafeDoc AI ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p className="text-gray-700">
              SafeDoc AI is provided by <strong>Toolset</strong> (<a href="https://toolsetlabs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">toolsetlabs.com</a>).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              SafeDoc AI is an AI-powered business document automation platform that enables users to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Generate business documents (invoices, contracts, NDAs, proposals)</li>
              <li>Translate documents into 50+ languages</li>
              <li>Add legal e-signatures to documents</li>
              <li>Integrate with CRM systems and payment processors</li>
              <li>Access pre-vetted legal clauses and templates</li>
              <li>Automate compliance checking (GDPR, CCPA, HIPAA, etc.)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-700 mb-4">
              You must create an account to use SafeDoc AI. You may register using:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Email and password</li>
              <li>Google OAuth</li>
              <li>GitHub OAuth</li>
              <li>Apple Sign-In</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Responsibility</h3>
            <p className="text-gray-700 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of unauthorized access</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Account Termination</h3>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate your account for violations of these Terms, fraudulent activity, or at our discretion with reasonable notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pricing and Payment</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Plans</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Free Plan:</strong> 10 documents/month, 5 languages, basic features ($0)</li>
              <li><strong>Pro Plan:</strong> 75 documents/month, 50+ languages, all features ($12/month)</li>
              <li><strong>Business Plan:</strong> Unlimited documents, team features ($39/month)</li>
              <li><strong>Enterprise Plan:</strong> White-label, SSO, SLA ($199/month)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Overage Charges</h3>
            <p className="text-gray-700 mb-4">
              If you exceed your plan's document limit:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Free Plan:</strong> $1.00 per document over 10</li>
              <li><strong>Pro Plan:</strong> $0.50 per document over 75</li>
              <li><strong>Business Plan:</strong> No overages (unlimited)</li>
            </ul>
            <p className="text-gray-700">
              Overage charges are billed at the end of each month.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Payment Processing</h3>
            <p className="text-gray-700 mb-4">
              Payments are processed securely through <strong>Stripe</strong>. We do not store your credit card information. By providing payment information, you authorize us to charge your payment method for applicable fees.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Refunds</h3>
            <p className="text-gray-700">
              All sales are final. We do not offer refunds except as required by law or at our sole discretion. You may cancel your subscription at any time, and access will continue until the end of your billing period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Permitted Use</h3>
            <p className="text-gray-700 mb-4">
              You may use SafeDoc AI for lawful business purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Generating legitimate business documents</li>
              <li>Automating document workflows</li>
              <li>Collaborating with team members</li>
              <li>Integrating with your business systems</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Prohibited Use</h3>
            <p className="text-gray-700 mb-4">
              You may NOT:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Use the Service for illegal activities or fraud</li>
              <li>Generate documents to deceive, harm, or defraud others</li>
              <li>Reverse engineer, decompile, or extract source code</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Use the Service to send spam or unsolicited communications</li>
              <li>Attempt to bypass usage limits or security measures</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Scrape, data mine, or extract data without permission</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Violate intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Our IP</h3>
            <p className="text-gray-700 mb-4">
              SafeDoc AI, including its code, design, logos, and content, is owned by <strong>Toolset</strong> and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our IP without written permission.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Your Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of documents you create using SafeDoc AI. By using the Service, you grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Process your content to provide the Service</li>
              <li>Store and backup your documents</li>
              <li>Use aggregated, anonymized data to improve the Service</li>
            </ul>
            <p className="text-gray-700">
              We do not claim ownership of your documents and will not use them for any purpose beyond providing the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 AI-Generated Content</h3>
            <p className="text-gray-700">
              Documents generated by our AI are provided for your use. You are responsible for reviewing and verifying all AI-generated content before use. We are not liable for errors, inaccuracies, or legal compliance of generated documents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Implied warranties of merchantability or fitness for a particular purpose</li>
              <li>Accuracy, reliability, or completeness of AI-generated content</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Security of data transmission or storage</li>
              <li>Legal compliance of generated documents</li>
            </ul>
            <p className="text-gray-700">
              You use SafeDoc AI at your own risk. We recommend reviewing all generated documents with legal counsel before use in critical situations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOOLSET SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Errors or inaccuracies in AI-generated documents</li>
              <li>Unauthorized access to your account or data</li>
              <li>Third-party services (Stripe, Google, GitHub, etc.)</li>
            </ul>
            <p className="text-gray-700">
              Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless Toolset, SafeDoc AI, and its affiliates from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any law or third-party rights</li>
              <li>Content you upload or generate</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data and Privacy</h2>
            <p className="text-gray-700">
              Your use of SafeDoc AI is also governed by our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. We collect, use, and protect your data as described in that policy. By using the Service, you consent to our data practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              SafeDoc AI integrates with third-party services:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Google Gemini:</strong> AI document generation</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Pusher:</strong> Real-time updates</li>
              <li><strong>OAuth Providers:</strong> Google, GitHub, Apple sign-in</li>
            </ul>
            <p className="text-gray-700">
              Your use of these services is subject to their respective terms and privacy policies. We are not responsible for third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
            <p className="text-gray-700 mb-4">
              You may terminate your account at any time from your account settings. Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Your access to the Service will be revoked</li>
              <li>Your data may be deleted after 30 days (backup retention)</li>
              <li>Subscription fees are non-refundable</li>
              <li>Outstanding overage charges remain due</li>
            </ul>
            <p className="text-gray-700">
              We may terminate or suspend your account for violations of these Terms or at our discretion with reasonable notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these Terms from time to time. We will notify you of material changes via email or a notice on the platform. Continued use after changes constitutes acceptance. If you disagree with changes, you must stop using the Service and terminate your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles. Any disputes shall be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              For disputes arising from these Terms:
            </p>
            <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
              <li>Contact us at <a href="mailto:legal@safedoc.ai" className="text-blue-600 hover:underline">legal@safedoc.ai</a> to resolve informally</li>
              <li>If unresolved, disputes shall be settled by binding arbitration</li>
              <li>You waive the right to participate in class action lawsuits</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Severability</h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, contact us:
            </p>
            <ul className="list-none mb-4 text-gray-700 space-y-2">
              <li><strong>Company:</strong> Toolset</li>
              <li><strong>Website:</strong> <a href="https://toolsetlabs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">toolsetlabs.com</a></li>
              <li><strong>Email:</strong> <a href="mailto:legal@safedoc.ai" className="text-blue-600 hover:underline">legal@safedoc.ai</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@safedoc.ai" className="text-blue-600 hover:underline">support@safedoc.ai</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm text-blue-900">
                <strong>✨ Summary:</strong> Use SafeDoc AI responsibly for legitimate business purposes. We provide the tools, you're responsible for how you use them. Pay on time, don't abuse the system, and respect others' rights. Questions? Contact us!
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Made with 💙 by <a href="https://toolsetlabs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Toolset</a>
          </p>
          <p className="mt-2">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900 mx-2">Privacy Policy</Link>
            <span className="text-gray-400">|</span>
            <Link to="/" className="text-gray-600 hover:text-gray-900 mx-2">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
