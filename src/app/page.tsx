import React from 'react';
import Footer from './components/Footer';
import Nav from './components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Nav></Nav>
      <main className="pt-24">
        <section className="container mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-5xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                From Conversations to Actions
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your team's communication into structured, actionable workflows with AI-powered project management.
              </p>
              <div className="flex gap-4 flex-wrap">
                <a href="/account" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                  Get Started Free
                </a>
                <a href="/account">
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors">
                  Watch Demo
                </button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-30 blur-xl"></div>
                <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="AI-driven workflows" className="relative rounded-xl shadow-xl"/>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: "Chat-to-Task Conversion",
                  description: "Turn conversations into structured tasks effortlessly",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  )
                },
                {
                  title: "Proactive Suggestions",
                  description: "AI-powered task optimization and risk mitigation",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  )
                },
                {
                  title: "Seamless Integrations",
                  description: "Compatible with Slack, Teams, and email",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  )
                }
              ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mb-6 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-black">{feature.title}</h3>
                <p className="text-black">{feature.description}</p>
              </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-6">Real-Time Analytics</h2>
                <p className="text-xl mb-8 text-blue-100">
                  Track your team's performance with advanced analytics. Get insights into productivity, collaboration patterns, and project progress.
                </p>
                <ul className="space-y-4">
                  {[
                    "Team velocity metrics",
                    "Task completion rates",
                    "Collaboration insights",
                    "Resource allocation",
                    "Predictive analytics"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-xl blur-xl"></div>
                <img src="https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Analytics Dashboard" className="relative rounded-xl shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using Tylz.AI to streamline their workflows
            </p>
            <a href="/account" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-lg inline-flex items-center gap-2">
              Start Free Trial
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      </main>

    <Footer></Footer>
    </div>
  );
};

export default Home;
      