import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, Calendar, ChevronRight, MessageCircle, Phone } from 'lucide-react'
import { getNeurotherapySettings, getWebsiteSettings, getPublishedFaqs } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 25 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function NeurotherapyPage() {
  const [data, setData] = useState({})
  const [settings, setSettings] = useState({})
  const [faqs, setFaqs] = useState([])
  const [activeFaq, setActiveFaq] = useState(null)
  const { lang, t } = useLanguage()

  useEffect(() => {
    Promise.all([getNeurotherapySettings(), getWebsiteSettings(), getPublishedFaqs()])
      .then(([d, s, f]) => { setData(d); setSettings(s); setFaqs(f.slice(0, 6)) })
      .catch(console.error)
  }, [])

  const phone = settings.phone || '+91 88711 93506'
  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  const processSteps = data.process_steps
    ? (typeof data.process_steps === 'string' ? JSON.parse(data.process_steps) : data.process_steps)
    : [
      { step: lang === 'hi' ? 'संपर्क करें' : 'Contact Us', desc: lang === 'hi' ? 'फोन या व्हाट्सएप पर पूछताछ करें' : 'Call or WhatsApp to enquire' },
      { step: lang === 'hi' ? 'परामर्श' : 'Consultation', desc: lang === 'hi' ? 'संक्षिप्त फोन परामर्श' : 'Brief phone consultation' },
      { step: lang === 'hi' ? 'होम विजिट' : 'Home Visit', desc: lang === 'hi' ? 'हम आपके घर आते हैं' : 'We come to your home' },
      { step: lang === 'hi' ? 'फॉलो-अप' : 'Follow-Up', desc: lang === 'hi' ? 'आवश्यकतानुसार निरंतर सहायता' : 'Ongoing support as needed' },
    ]

  const supportAreas = [
    lang === 'hi' ? 'गतिशीलता सहायता' : 'Mobility support',
    lang === 'hi' ? 'आराम की देखभाल' : 'Comfort care',
    lang === 'hi' ? 'तंत्रिका तंत्र वेलनेस' : 'Nervous system wellness',
    lang === 'hi' ? 'समग्र कल्याण' : 'Overall well-being',
    lang === 'hi' ? 'घर पर व्यक्तिगत देखभाल' : 'Personalized home care',
    lang === 'hi' ? 'दीर्घकालिक वेलनेस सहायता' : 'Long-term wellness support',
  ]

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'न्यूरोथेरेपी – Neurotherapist Naveen Sharma' : 'Neurotherapy – Neurotherapist Naveen Sharma'}</title>
        <meta name="description" content="Learn about our neurotherapy approach. Gentle, supportive home visit wellness care." />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#063B63] to-[#159A8C] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest bg-white/15 rounded-full px-4 py-2 mb-4 text-blue-100">
            {lang === 'hi' ? 'न्यूरोथेरेपी' : 'Neurotherapy'}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {data.intro_heading || (lang === 'hi' ? 'न्यूरोथेरेपी को समझना' : 'Understanding Neurotherapy')}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            {data.intro_text || (lang === 'hi' ? 'समग्र आराम और गतिशीलता का समर्थन करने के लिए एक सहायक वेलनेस दृष्टिकोण' : 'A supportive wellness approach for comfort, mobility and overall well-being')}
          </p>
        </div>
      </div>

      {/* What is Neurotherapy */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#063B63] mb-5">
                {data.what_heading || (lang === 'hi' ? 'न्यूरोथेरेपी क्या है?' : 'What is Neurotherapy?')}
              </h2>
              <p className="text-[#3D5A73] text-sm md:text-base leading-relaxed mb-5">
                {data.what_text || 'Neurotherapy focuses on supporting the nervous system through gentle, non-invasive techniques. It is designed to complement your overall wellness journey, with an emphasis on comfort and mobility.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {supportAreas.map((area, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#3D5A73] text-sm">
                    <CheckCircle size={15} className="text-[#159447] flex-shrink-0" />
                    {area}
                  </div>
                ))}
              </div>
            </motion.div>
            <div>
              {data.image ? (
                <img src={data.image} alt="Neurotherapy" className="w-full rounded-3xl shadow-xl object-cover" />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-[#F5FAFC] to-[#E8F4FF] rounded-3xl border border-blue-100 flex items-center justify-center">
                  <div className="text-center p-8">
                  <div className="w-20 h-20 bg-[#0877B8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0877B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.24z"/>
                        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.24z"/>
                      </svg>
                    </div>
                    <p className="text-[#063B63] font-bold text-xl">{lang === 'hi' ? 'न्यूरोथेरेपी' : 'Neurotherapy'}</p>
                    <p className="text-[#3D5A73] text-sm mt-1">{lang === 'hi' ? 'सहायक वेलनेस देखभाल' : 'Supportive wellness care'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-10 md:py-16 bg-[#F5FAFC]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#063B63] mb-4">
              {data.approach_heading || (lang === 'hi' ? 'हमारा दृष्टिकोण' : 'Our Approach')}
            </h2>
            <p className="text-[#3D5A73] text-sm md:text-base leading-relaxed">
              {data.approach_text || 'Our approach is individualized, gentle and focused on your comfort. Each session is tailored to your specific wellness needs and conducted in the comfort of your own home.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { color: 'bg-blue-100 text-blue-600', symbol: '✦', title: lang === 'hi' ? 'व्यक्तिगत' : 'Individualized', desc: lang === 'hi' ? 'प्रत्येक सत्र आपकी विशिष्ट वेलनेस आवश्यकताओं के अनुसार तैयार किया गया है।' : 'Each session is tailored to your specific wellness needs and comfort.' },
              { color: 'bg-teal-100 text-teal-600', symbol: '❋', title: lang === 'hi' ? 'कोमल' : 'Gentle', desc: lang === 'hi' ? 'हमारा दृष्टिकोण कोमल और गैर-आक्रामक है, आपकी भलाई पर ध्यान केंद्रित करते हुए।' : 'Our approach is gentle and non-invasive, always focused on your comfort and well-being.' },
              { color: 'bg-green-100 text-green-600', symbol: '⌂', title: lang === 'hi' ? 'घर पर' : 'At Your Home', desc: lang === 'hi' ? 'सभी सत्र आपके अपने घर के आराम में आयोजित किए जाते हैं।' : 'All sessions are conducted in the comfort and familiarity of your own home.' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50 text-center">
                <div className={`w-14 h-14 ${card.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold`}>
                  {card.symbol}
                </div>
                <h3 className="font-bold text-[#063B63] text-base mb-2">{card.title}</h3>
                <p className="text-[#3D5A73] text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Home Visit Model */}
      <section className="py-10 md:py-16 bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5">
                {data.home_visit_heading || (lang === 'hi' ? 'होम विजिट मॉडल' : 'Home Visit Model')}
              </h2>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-6">
                {data.home_visit_text || 'We believe in bringing care to you. All our neurotherapy sessions are conducted in the comfort of your own home, saving you travel time and effort while providing professional wellness support.'}
              </p>
              <div className="space-y-4">
                {[
                  { color: 'text-red-300', symbol: '✕', text: lang === 'hi' ? 'कोई क्लिनिक या अस्पताल नहीं' : 'No clinic or hospital visits' },
                  { color: 'text-green-300', symbol: '⌂', text: lang === 'hi' ? 'आपके घर पर पेशेवर देखभाल' : 'Professional care at your home' },
                  { color: 'text-blue-300', symbol: '◈', text: lang === 'hi' ? 'सुविधाजनक अपॉइंटमेंट समय' : 'Convenient appointment times' },
                  { color: 'text-teal-300', symbol: '◉', text: lang === 'hi' ? 'निजी और आरामदायक वातावरण' : 'Private and comfortable environment' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`text-xl font-bold ${item.color}`}>{item.symbol}</span>
                    <span className="text-blue-100">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 md:p-8">
              <h3 className="text-xl font-bold mb-6">
                {data.process_heading || (lang === 'hi' ? 'अपॉइंटमेंट प्रक्रिया' : 'Appointment Process')}
              </h3>
              <div className="space-y-5">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-[#063B63] font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{step.step}</div>
                      <div className="text-blue-200 text-sm mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/appointment" className="mt-8 w-full flex items-center justify-center gap-2 bg-white text-[#063B63] font-bold py-3 rounded-full hover:shadow-lg transition-all">
                <Calendar size={17} /> {t.nav.bookAppointment}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who may seek wellness */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#063B63] mb-4">
            {lang === 'hi' ? 'कौन वेलनेस सहायता चाह सकता है?' : 'Who May Seek Wellness Support?'}
          </h2>
          <p className="text-[#3D5A73] mb-8">
            {lang === 'hi' ? 'हमारी सहायक वेलनेस सेवाएं इन लोगों के लिए उपयुक्त हो सकती हैं:' : 'Our supportive wellness services may be suitable for individuals experiencing:'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { bg: 'bg-red-50', color: 'text-red-500', symbol: '◈', label: lang === 'hi' ? 'जोड़ और हड्डी असुविधा' : 'Joint & bone discomfort' },
              { bg: 'bg-blue-50', color: 'text-blue-500', symbol: '◉', label: lang === 'hi' ? 'तंत्रिका संबंधी चुनौतियां' : 'Neurological challenges' },
              { bg: 'bg-yellow-50', color: 'text-yellow-500', symbol: '✦', label: lang === 'hi' ? 'दर्द और असुविधा' : 'Pain & discomfort' },
              { bg: 'bg-purple-50', color: 'text-purple-500', symbol: '♦', label: lang === 'hi' ? 'वृद्ध व्यक्ति देखभाल' : 'Senior citizen care' },
              { bg: 'bg-teal-50', color: 'text-teal-500', symbol: '↺', label: lang === 'hi' ? 'रिकवरी अवधि' : 'Recovery periods' },
              { bg: 'bg-green-50', color: 'text-green-500', symbol: '✿', label: lang === 'hi' ? 'समग्र वेलनेस' : 'Overall wellness' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} border border-blue-100 rounded-xl p-3 sm:p-4 text-center hover:shadow-sm transition-all`}>
                <div className={`text-3xl font-bold mb-2 ${item.color}`}>{item.symbol}</div>
                <p className="text-[#3D5A73] text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-10 md:py-16 bg-[#F5FAFC]">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#063B63] mb-6 text-center">
              {lang === 'hi' ? 'सामान्य प्रश्न' : 'Common Questions'}
            </h2>
            <div className="space-y-3">
              {faqs.map(faq => (
                <div key={faq.id} className="bg-white rounded-2xl border border-blue-50 overflow-hidden shadow-sm">
                  <button onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
                    <span className="font-semibold text-[#063B63] text-sm">
                      {lang === 'hi' && faq.question_hi ? faq.question_hi : faq.question}
                    </span>
                    <ChevronRight size={17} className={`flex-shrink-0 text-[#0877B8] transition-transform ${activeFaq === faq.id ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaq === faq.id && (
                    <div className="px-5 pb-4 text-[#3D5A73] text-sm leading-relaxed border-t border-blue-50 pt-3">
                      {lang === 'hi' && faq.answer_hi ? faq.answer_hi : faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-[#159A8C] to-[#063B63] text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">{lang === 'hi' ? 'अपनी वेलनेस यात्रा शुरू करें' : 'Start Your Wellness Journey'}</h2>
          <p className="text-teal-100 mb-6">{lang === 'hi' ? 'होम विजिट अपॉइंटमेंट बुक करें।' : 'Book your home visit appointment today.'}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/appointment" className="inline-flex items-center gap-2 bg-white text-[#063B63] font-bold px-6 py-3 rounded-full hover:shadow-lg transition-all">
              <Calendar size={17} /> {t.nav.bookAppointment}
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full hover:shadow-lg transition-all">
              <MessageCircle size={17} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
