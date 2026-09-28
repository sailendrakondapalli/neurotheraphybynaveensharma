import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import BreakingNewsTicker from '../components/BreakingNewsTicker'

export default function TeamPage() {
  return (
    <>
      <Helmet>
        <title>Our Team - SR TV NEWS CHANNEL</title>
        <meta name="description" content="Meet the talented team behind SR TV NEWS CHANNEL." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <BreakingNewsTicker />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#00154A] to-[#000C2E] text-white py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
            <p className="text-xl text-[#AAB8D4] max-w-3xl">
              Meet the dedicated journalists, anchors, and professionals bringing you the news 24/7.
            </p>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#00154A] mb-12 text-center">Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Rajesh Kumar',
                  role: 'Editor-in-Chief',
                  bio: '25+ years of experience in broadcast journalism'
                },
                {
                  name: 'Priya Sharma',
                  role: 'Managing Editor',
                  bio: 'Award-winning investigative journalist'
                },
                {
                  name: 'Amit Verma',
                  role: 'News Director',
                  bio: 'Expert in political and economic reporting'
                }
              ].map((member, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#00154A] to-[#0035A3] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold text-[#00154A] text-center mb-1">{member.name}</h3>
                  <p className="text-[#0066FF] text-sm font-medium text-center mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm text-center">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reporters Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#00154A] mb-4 text-center">Our Reporters</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Our team of experienced reporters brings you stories from across India and around the world.
              Visit the <a href="/admin/reporters" className="text-[#0066FF] hover:underline">Reporters section</a> to see our complete roster.
            </p>
            
            <div className="bg-gradient-to-br from-[#00154A] to-[#000C2E] text-white p-12 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Join Our Team</h3>
              <p className="text-[#AAB8D4] mb-6 max-w-2xl mx-auto">
                We're always looking for talented journalists, videographers, editors, and media professionals 
                to join our growing team.
              </p>
              <a href="/careers" 
                className="inline-block px-8 py-3 bg-[#E60012] text-white font-semibold rounded-lg hover:bg-[#FF1A1A] transition-colors">
                View Open Positions
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}


