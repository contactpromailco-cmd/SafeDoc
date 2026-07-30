/**
 * Landing Page - SafeDoc AI
 * High-converting landing page with hero, features, pricing, and CTA
 */

import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowAuth(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📄</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SafeDoc AI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="https://github.com/contactpromailco-cmd/SafeDoc" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                GitHub
              </a>
              <button
                onClick={handleLogin}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={handleLogin}
                className="text-sm font-medium text-gray-600"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg font-semibold"
              >
                Start Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-full">
            <span className="text-xs sm:text-sm font-medium text-blue-600">
              🚀 All 11 Features Live • 50+ Languages • Enterprise Ready
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-4">
            <span className="block text-gray-900 mb-2">AI-Powered Documents</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              That Do Everything
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Generate, translate, sign, sync, and track business documents in seconds.
            From invoices to contracts, in 50+ languages, with full compliance.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <button
              onClick={handleGetStarted}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-base sm:text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Start Free → 10 docs/month
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-base sm:text-lg hover:border-gray-300 transition-all"
            >
              View Features
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">11</div>
              <div className="text-xs sm:text-sm text-gray-600">Features</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">50+</div>
              <div className="text-xs sm:text-sm text-gray-600">Languages</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">1000+</div>
              <div className="text-xs sm:text-sm text-gray-600">Legal Clauses</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">$12</div>
              <div className="text-xs sm:text-sm text-gray-600">/month Pro</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need. One Platform.</h2>
            <p className="text-xl text-gray-600">Features that would cost $500+/month elsewhere. Included in every plan.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {[
              {
                icon: '🤖',
                title: 'AI Document Generation',
                description: 'Generate invoices, contracts, NDAs, proposals instantly with Gemini AI',
                badge: 'Core'
              },
              {
                icon: '🌍',
                title: '50+ Languages',
                description: 'Translate documents to Spanish, French, Chinese, Arabic, and 46 more',
                badge: 'Global'
              },
              {
                icon: '✍️',
                title: 'E-Signatures',
                description: 'Legal e-signatures with audit trails. ESIGN, UETA, eIDAS compliant',
                badge: 'Legal'
              },
              {
                icon: '💰',
                title: 'Payment Links',
                description: 'Embedded Stripe payment buttons. Get paid 40% faster',
                badge: 'Revenue'
              },
              {
                icon: '🛡️',
                title: 'Compliance Checker',
                description: 'Auto-scan for GDPR, CCPA, HIPAA, SOC2. Pass audits easily',
                badge: 'Security'
              },
              {
                icon: '🔗',
                title: 'CRM Integration',
                description: 'Sync to HubSpot, Salesforce, Pipedrive, Zoho automatically',
                badge: 'Automation'
              },
              {
                icon: '📚',
                title: 'Template Marketplace',
                description: '100+ professional templates. Create and sell your own',
                badge: 'Community'
              },
              {
                icon: '📋',
                title: '1000+ Legal Clauses',
                description: 'Pre-vetted clauses for any contract. Jurisdiction-aware',
                badge: 'Legal'
              },
              {
                icon: '🎤',
                title: 'Voice-to-Document',
                description: 'Record meetings, get instant transcripts and action items',
                badge: 'AI'
              },
              {
                icon: '📊',
                title: 'Analytics Dashboard',
                description: 'Track every document, revenue, and user behavior',
                badge: 'Insights'
              },
              {
                icon: '🔄',
                title: 'Smart Chains',
                description: 'AI suggests next documents. Complete workflows faster',
                badge: 'AI'
              },
              {
                icon: '🪝',
                title: 'Webhooks & API',
                description: '61 REST endpoints. 12+ webhook events. Build anything',
                badge: 'Developer'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{feature.icon}</div>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-lg sm:text-xl text-gray-600">No hidden fees. Cancel anytime. All features included.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Free</div>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-600">Perfect to try</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">✓</span>
                  <span className="text-sm">10 documents/month</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">✓</span>
                  <span className="text-sm">5 languages</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">✓</span>
                  <span className="text-sm">Basic templates</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">✓</span>
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              
              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all text-sm"
              >
                Get Started
              </button>
            </div>

            {/* Pro Tier - Popular */}
            <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-purple-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-500 relative shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="inline-block px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md">
                  Most Popular
                </span>
              </div>
              
              <div className="mb-6 mt-2">
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Pro</div>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">$12</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-600">For freelancers</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-800">
                  <span className="text-blue-600 mr-3 text-lg font-bold flex-shrink-0">✓</span>
                  <span className="text-sm font-semibold">75 documents/month</span>
                </li>
                <li className="flex items-start text-gray-800">
                  <span className="text-blue-600 mr-3 text-lg font-bold flex-shrink-0">✓</span>
                  <span className="text-sm font-semibold">50+ languages</span>
                </li>
                <li className="flex items-start text-gray-800">
                  <span className="text-blue-600 mr-3 text-lg font-bold flex-shrink-0">✓</span>
                  <span className="text-sm font-semibold">All 11 features</span>
                </li>
                <li className="flex items-start text-gray-800">
                  <span className="text-blue-600 mr-3 text-lg font-bold flex-shrink-0">✓</span>
                  <span className="text-sm">$0.50 per extra doc</span>
                </li>
              </ul>
              
              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all text-sm"
              >
                Start Free Trial
              </button>
            </div>

            {/* Business Tier */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Business</div>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">$39</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-600">For teams</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">✓</span>
                  <span className="text-sm font-semibold">Unlimited documents</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">✓</span>
                  <span className="text-sm">Team collaboration</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">✓</span>
                  <span className="text-sm">CRM integration</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-3 text-lg flex-shrink-0">✓</span>
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              
              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all text-sm"
              >
                Start Business
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 sm:p-8 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all">
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Enterprise</div>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-white">$199</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-400">For companies</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-200">
                  <span className="text-green-400 mr-3 text-lg font-bold flex-shrink-0">✓</span>
                  <span className="text-sm">Everything in Business</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <span className="text-green-400 mr-3 text-lg font-bold flex-shrink-0">✓</span>
                  <span className="text-sm">White-label branding</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <span className="text-green-400 mr-3 text-lg font-bold flex-shrink-0">✓</span>
                  <span className="text-sm">SSO & SAML</span>
                </li>
                <li className="flex items-start text-gray-200">
                  <span className="text-green-400 mr-3 text-lg font-bold flex-shrink-0">✓</span>
                  <span className="text-sm">99.9% SLA guarantee</span>
                </li>
              </ul>
              
              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all text-sm"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using SafeDoc AI to save time and money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Start Free Today
            </button>
            <button
              onClick={() => window.open('https://github.com/contactpromailco-cmd/SafeDoc', '_blank')}
              className="px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold text-lg hover:bg-blue-800 transition-all"
            >
              View on GitHub
            </button>
          </div>
          <p className="text-blue-100 mt-6 text-sm">
            No credit card required • 10 documents free • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">📄</span>
                <span className="text-xl font-bold text-white">SafeDoc AI</span>
              </div>
              <p className="text-sm mb-4">
                AI-powered business documents. Generate, translate, sign, and sync in seconds.
              </p>
              <p className="text-sm text-gray-400">
                Made with 💙 by{' '}
                <a
                  href="https://toolsetlabs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Toolset
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="https://github.com/contactpromailco-cmd/SafeDoc" target="_blank" rel="noopener noreferrer" className="hover:text-white">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/contactpromailco-cmd/SafeDoc" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
                <li><a href="https://toolsetlabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Toolset Labs</a></li>
                <li><a href="mailto:support@safedoc.ai" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="https://github.com/contactpromailco-cmd/SafeDoc" target="_blank" rel="noopener noreferrer" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 SafeDoc AI. All rights reserved.</p>
            <p className="mt-2 text-gray-400">
              Built with 💙 and AI by{' '}
              <a
                href="https://toolsetlabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Toolset
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultMode={authMode}
      />
    </div>
  );
};

export default Landing;
