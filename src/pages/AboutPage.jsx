import { Helmet } from 'react-helmet-async'
import { Users, Target, Award, TrendingUp } from 'lucide-react'
import BreakingNewsTicker from '../components/BreakingNewsTicker'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us - SR TV NEWS CHANNEL</title>
        <meta name="description" content="Learn about SR TV NEWS CHANNEL - Your trusted source for breaking news and in-depth journalism." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <BreakingNewsTicker />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#00154A] to-[#000C2E] text-white py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About SR TV NEWS CHANNEL</h1>
            <p className="text-xl text-[#AAB8D4] max-w-3xl">
              India's trusted voice for breaking news, in-depth analysis, and fearless journalism.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#00154A] mb-4">Our Story</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    SR TV NEWS CHANNEL was founded with a singular mission: to deliver accurate, unbiased, 
                    and impactful news to millions of Indians seeking truth and transparency.
                  </p>
                  <p>
                    From breaking news to investigative journalism, from political analysis to human interest 
                    stories, we cover the issues that matter most to our viewers across India and the world.
                  </p>
                  <p>
                    Our team of dedicated reporters, anchors, and editors work around the clock to bring you 
                    comprehensive coverage of events as they unfold, ensuring you stay informed every moment.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#00154A] to-[#0035A3] p-6 rounded-lg text-white">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm text-[#AAB8D4]">Live News Coverage</div>
                </div>
                <div className="bg-gradient-to-br from-[#E60012] to-[#FF1A1A] p-6 rounded-lg text-white">
                  <div className="text-3xl font-bold mb-2">100+</div>
                  <div className="text-sm">Expert Journalists</div>
                </div>
                <div className="bg-gradient-to-br from-[#0035A3] to-[#0066FF] p-6 rounded-lg text-white">
                  <div className="text-3xl font-bold mb-2">15+</div>
                  <div className="text-sm">Bureau Offices</div>
                </div>
                <div className="bg-gradient-to-br from-[#000C2E] to-[#00154A] p-6 rounded-lg text-white">
                  <div className="text-3xl font-bold mb-2">50M+</div>
                  <div className="text-sm text-[#AAB8D4]">Monthly Viewers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#00154A] mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: <Target size={32} />,
                  title: 'Truth First',
                  desc: 'Unbiased reporting and fact-based journalism'
                },
                {
                  icon: <Award size={32} />,
                  title: 'Excellence',
                  desc: 'Highest standards in news production and delivery'
                },
                {
                  icon: <Users size={32} />,
                  title: 'People-Centric',
                  desc: 'Stories that matter to everyday Indians'
                },
                {
                  icon: <TrendingUp size={32} />,
                  title: 'Innovation',
                  desc: 'Leveraging technology for better news experience'
                }
              ].map((value, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-[#0066FF] mb-3">{value.icon}</div>
                  <h3 className="text-xl font-bold text-[#00154A] mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tagline Section */}
        <section className="py-16 bg-gradient-to-br from-[#00154A] to-[#000C2E] text-white">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Inform • Inspire • Empower</h2>
            <p className="text-xl text-[#AAB8D4] max-w-2xl mx-auto">
              We don't just report the news—we inform citizens, inspire action, and empower communities 
              to make a difference.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
