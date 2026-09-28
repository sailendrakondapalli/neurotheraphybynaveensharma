import { Helmet } from 'react-helmet-async'
import { Briefcase, Users, Trophy, Heart } from 'lucide-react'
import BreakingNewsTicker from '../components/BreakingNewsTicker'

export default function CareersPage() {
  const openPositions = [
    {
      title: 'Senior News Reporter',
      location: 'New Delhi',
      type: 'Full-time',
      dept: 'Editorial'
    },
    {
      title: 'Video Editor',
      location: 'Mumbai',
      type: 'Full-time',
      dept: 'Production'
    },
    {
      title: 'News Anchor',
      location: 'Hyderabad',
      type: 'Full-time',
      dept: 'On-Air Talent'
    },
    {
      title: 'Digital Content Producer',
      location: 'Bangalore',
      type: 'Full-time',
      dept: 'Digital'
    },
    {
      title: 'Camera Operator',
      location: 'Multiple Locations',
      type: 'Full-time',
      dept: 'Production'
    },
    {
      title: 'Social Media Manager',
      location: 'New Delhi',
      type: 'Full-time',
      dept: 'Digital Marketing'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Careers - SR TV NEWS CHANNEL</title>
        <meta name="description" content="Join the SR TV NEWS CHANNEL team and be part of India's trusted news source." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <BreakingNewsTicker />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#00154A] to-[#000C2E] text-white py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl text-[#AAB8D4] max-w-3xl">
              Be part of a team that's shaping the future of journalism in India.
            </p>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#00154A] mb-12 text-center">Why Work With Us?</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: <Trophy size={32} />,
                  title: 'Award-Winning',
                  desc: 'Work alongside India\'s most respected journalists'
                },
                {
                  icon: <Users size={32} />,
                  title: 'Collaborative',
                  desc: 'Supportive team environment that values your input'
                },
                {
                  icon: <Briefcase size={32} />,
                  title: 'Growth',
                  desc: 'Clear career progression and learning opportunities'
                },
                {
                  icon: <Heart size={32} />,
                  title: 'Impact',
                  desc: 'Make a difference by informing millions of Indians'
                }
              ].map((benefit, idx) => (
                <div key={idx} className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00154A] to-[#0035A3] text-white rounded-full mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#00154A] mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#00154A] mb-12 text-center">Open Positions</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              {openPositions.map((job, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#00154A] mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span>{job.type}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-[#0066FF] font-medium">{job.dept}</span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-[#E60012] text-white font-semibold rounded-lg hover:bg-[#FF1A1A] transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-br from-[#00154A] to-[#000C2E] text-white">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't See a Position That Fits?</h2>
            <p className="text-[#AAB8D4] mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind 
              for future opportunities.
            </p>
            <a href="/contact" 
              className="inline-block px-8 py-3 bg-white text-[#00154A] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Contact HR Team
            </a>
          </div>
        </section>
      </div>
    </>
  )
}


