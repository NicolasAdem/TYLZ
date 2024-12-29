import React from 'react';
import Footer from '../components/Footer';
import Nav from '../components/Navigation';

interface SocialIconProps {
    href: string;
    icon: React.ReactNode;
}

const PricingPage = () => {
  return (
    <div className="font-sans bg-white">
      <Nav></Nav>
      <main className="pt-20">
        <section className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Choose the Perfect Plan for Your Team</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Flexible pricing to suit teams of all sizes and needs.
          </p>
        </section>

        <section className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border-2 border-transparent hover:border-blue-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Free</span>
                <span className="text-gray-700">/month</span>
              </div>
              <ul className="space-y-4 mb-8 text-gray-700">
                <li className="flex items-center">
                  <CheckIcon />
                  Basic AI-powered task management
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Up to 5 team members
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Basic chat integration
                </li>
              </ul>
              <a href="#" className="block w-full bg-blue-700 text-white text-center py-3 rounded-full hover:bg-blue-800">
                Get Started
              </a>
            </div>

            {/* Professional Plan */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border-2 border-blue-700 transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-blue-700 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">€15</span>
                <span className="text-gray-700">/user/month</span>
              </div>
              <ul className="space-y-4 mb-8 text-gray-700">
                <li className="flex items-center">
                  <CheckIcon />
                  All Starter features
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Custom integrations
                </li>
              </ul>
              <a href="#" className="block w-full bg-blue-700 text-white text-center py-3 rounded-full hover:bg-blue-800">
                Choose Professional
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border-2 border-transparent hover:border-blue-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
                <span className="text-gray-700"> pricing</span>
              </div>
              <ul className="space-y-4 mb-8 text-gray-700">
                <li className="flex items-center">
                  <CheckIcon />
                  All Professional features
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Dedicated success manager
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Custom AI training
                </li>
                <li className="flex items-center">
                  <CheckIcon />
                  Enterprise security
                </li>
              </ul>
              <a href="#" className="block w-full bg-blue-700 text-white text-center py-3 rounded-full hover:bg-blue-800">
                Contact Sales
              </a>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="p-4 text-left text-gray-900">Feature</th>
                  <th className="p-4 text-center text-gray-900">Starter</th>
                  <th className="p-4 text-center text-gray-900">Professional</th>
                  <th className="p-4 text-center text-gray-900">Custom</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="p-4">Team members</td>
                  <td className="p-4 text-center">Up to 5</td>
                  <td className="p-4 text-center">Unlimited</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">AI task management</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Advanced</td>
                  <td className="p-4 text-center">Custom</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Integrations</td>
                  <td className="p-4 text-center">Limited</td>
                  <td className="p-4 text-center">Full</td>
                  <td className="p-4 text-center">Custom</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4">Support</td>
                  <td className="p-4 text-center">Email</td>
                  <td className="p-4 text-center">Priority</td>
                  <td className="p-4 text-center">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-blue-700 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Not Sure?</h2>
            <p className="text-xl mb-8">Try Tylz.AI free for 14 days. No credit card required.</p>
            <a href="/account" className="bg-white text-blue-700 px-8 py-3 rounded-full hover:bg-gray-100 text-lg font-semibold inline-block">
              Start Your Free Trial
            </a>
          </div>
        </section>

        <Footer></Footer>
      </main>
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
  </svg>
);

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon }) => (
    <a href={href} className="hover:text-blue-500 text-gray-700">
      {icon}
    </a>
);

const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
  </svg>
);

export default PricingPage;