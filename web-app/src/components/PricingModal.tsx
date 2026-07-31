/**
 * Pricing Modal - Upgrade Plans
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (plan: 'pro' | 'business') => {
    if (!token) {
      alert('Please login first');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, interval }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        alert('Stripe not configured yet. Add STRIPE_SECRET_KEY to backend .env');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out',
      features: [
        '10 documents/month',
        'Additional docs: $1.00 each',
        'All document types',
        '2 themes (Modern + Minimal)',
        'Basic AI generation',
        'Download as PNG',
        'SafeDoc branding',
        'Community support',
      ],
      color: 'from-gray-400 to-gray-500',
      current: user?.plan === 'free',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 12, yearly: 120 },
      description: 'Best for freelancers',
      features: [
        '75 documents/month',
        'Additional docs: $0.50 each',
        'All document types',
        'All 4 themes',
        'Full AI generation',
        'Basic batch generation (5)',
        'Remove branding',
        'Email support',
      ],
      color: 'from-blue-500 to-purple-500',
      popular: true,
      current: user?.plan === 'pro',
    },
    {
      id: 'business',
      name: 'Business',
      price: { monthly: 39, yearly: 390 },
      description: 'For growing teams',
      features: [
        'Unlimited documents',
        'No overage charges!',
        'Everything in Pro',
        'Unlimited batch generation',
        'Email auto-send',
        'Advanced fraud detection',
        'Smart AI suggestions',
        'Version history',
        'Document analytics',
        '3 team members',
        'Priority support',
      ],
      color: 'from-purple-500 to-pink-500',
      current: user?.plan === 'business',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Choose Your Plan</h2>
              <p className="text-gray-600 mt-1">Upgrade anytime, cancel anytime</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>
          </div>

          {/* Interval Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                interval === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                interval === 'yearly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Yearly <span className="text-xs">(Save 17%)</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 ${
                plan.popular ? 'border-purple-500 shadow-xl' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Current Plan
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">
                  ${plan.price[interval]}
                </span>
                <span className="text-gray-600">
                  /{interval === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : plan.current ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-green-100 text-green-700 font-semibold cursor-default"
                >
                  ✓ Active
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id as 'pro' | 'business')}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${plan.color} hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50`}
                >
                  {loading ? '⏳ Loading...' : '✨ Upgrade Now'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-3xl">
          <div className="text-center text-sm text-gray-600">
            <p>💳 Secure payment via Stripe • Cancel anytime • No hidden fees</p>
            <p className="mt-2">🎁 <strong>All plans include:</strong> Specialized document layouts • AI generation • Fraud detection • Email delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
