import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, ChevronRight, ArrowLeft } from 'lucide-react'
import { useLanguage } from '../lib/LanguageContext'

const WA_NUMBER = '918871193506'
const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

// ── CONVERSATION TREE ─────────────────────────────────────────
const TREE = {
  start: {
    bot: { en: "Hi! 👋 I'm the assistant for Neurotherapist Naveen Sharma.\n\nHow can I help you today?", hi: "नमस्ते! 👋 मैं न्यूरोथेरेपिस्ट नवीन शर्मा का सहायक हूं।\n\nआज मैं आपकी कैसे मदद कर सकता हूं?" },
    options: [
      { id: 'book',     en: '📅 Book Appointment',      hi: '📅 अपॉइंटमेंट बुक करें' },
      { id: 'services', en: '🩺 Our Services',           hi: '🩺 हमारी सेवाएं' },
      { id: 'cost',     en: '💰 Treatment Cost',         hi: '💰 उपचार की लागत' },
      { id: 'area',     en: '📍 Service Area – Bhopal',  hi: '📍 सेवा क्षेत्र – भोपाल' },
      { id: 'connect',  en: '💬 Talk to Naveen Sharma',  hi: '💬 नवीन शर्मा से बात करें' },
    ],
  },
  book: {
    bot: { en: "Great choice! 🏠\n\nWe provide *Home Visit* neurotherapy – we come to you.\n\nTap below to send a booking request on WhatsApp and Naveen Sharma will confirm your slot.", hi: "बढ़िया! 🏠\n\nहम *होम विजिट* न्यूरोथेरेपी प्रदान करते हैं – हम आपके पास आते हैं।\n\nव्हाट्सएप पर बुकिंग अनुरोध भेजें और नवीन शर्मा आपका समय निर्धारित करेंगे।" },
    options: [
      { wa: true, en: '📲 Send Booking Request', hi: '📲 बुकिंग अनुरोध भेजें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I would like to book a Neurotherapy home visit appointment. Please let me know about availability.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मैं न्यूरोथेरेपी होम विजिट अपॉइंटमेंट बुक करना चाहता/चाहती हूं। कृपया उपलब्धता बताएं।' } },
      { id: 'start', back: true, en: '← Main Menu', hi: '← मुख्य मेनू' },
    ],
  },
  services: {
    bot: { en: "We offer home-based neurotherapy for: 🩺", hi: "हम निम्नलिखित के लिए घर-आधारित न्यूरोथेरेपी प्रदान करते हैं: 🩺" },
    options: [
      { id: 'pain',      en: '🔴 Pain Relief & Nerve Care', hi: '🔴 दर्द व तंत्रिका देखभाल' },
      { id: 'cervical',  en: '🟠 Cervical / Neck Pain',     hi: '🟠 सर्वाइकल / गर्दन दर्द' },
      { id: 'back',      en: '🟡 Back Pain / Sciatica',     hi: '🟡 कमर दर्द / साइटिका' },
      { id: 'knee',      en: '🟢 Knee & Joint Pain',        hi: '🟢 घुटना / जोड़ दर्द' },
      { id: 'migraine',  en: '🔵 Migraine / Headache',      hi: '🔵 माइग्रेन / सिरदर्द' },
      { id: 'senior',    en: '💜 Senior Citizen Care',      hi: '💜 वरिष्ठ नागरिक देखभाल' },
      { id: 'start', back: true, en: '← Main Menu', hi: '← मुख्य मेनू' },
    ],
  },
  pain: {
    bot: { en: "🔴 *Pain Relief & Nerve Care*\n\nGentle home-based neurotherapy to help manage pain and support nerve health.\n\n🏠 We come to your home\n📅 By appointment only", hi: "🔴 *दर्द व तंत्रिका देखभाल*\n\nदर्द प्रबंधन और तंत्रिका स्वास्थ्य के लिए कोमल घर-आधारित न्यूरोथेरेपी।\n\n🏠 हम आपके घर आते हैं\n📅 केवल अपॉइंटमेंट पर" },
    options: [
      { wa: true, en: '📲 Book for Pain Relief', hi: '📲 दर्द राहत के लिए बुक करें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I need neurotherapy for Pain Relief & Nerve Care. Please share details about home visit sessions.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मुझे दर्द राहत और तंत्रिका देखभाल के लिए न्यूरोथेरेपी चाहिए। होम विजिट के बारे में बताएं।' } },
      { id: 'services', back: true, en: '← All Services', hi: '← सभी सेवाएं' },
    ],
  },
  cervical: {
    bot: { en: "🟠 *Cervical / Neck Pain*\n\nGentle neurotherapy to support neck comfort and reduce cervical discomfort at your home.\n\n🏠 Home Visit\n📅 Appointment Based", hi: "🟠 *सर्वाइकल / गर्दन दर्द*\n\nआपके घर पर गर्दन के आराम के लिए कोमल न्यूरोथेरेपी।\n\n🏠 होम विजिट\n📅 अपॉइंटमेंट आधारित" },
    options: [
      { wa: true, en: '📲 Book for Cervical Pain', hi: '📲 सर्वाइकल के लिए बुक करें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I need neurotherapy for Cervical / Neck Pain. Please share details about home visit sessions.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मुझे सर्वाइकल / गर्दन दर्द के लिए न्यूरोथेरेपी चाहिए।' } },
      { id: 'services', back: true, en: '← All Services', hi: '← सभी सेवाएं' },
    ],
  },
  back: {
    bot: { en: "🟡 *Back Pain / Sciatica*\n\nSupportive neurotherapy to help manage back discomfort and sciatic nerve issues at your home.\n\n🏠 Home Visit\n📅 Appointment Based", hi: "🟡 *कमर दर्द / साइटिका*\n\nआपके घर पर कमर दर्द और सायटिक तंत्रिका की समस्याओं के लिए सहायक न्यूरोथेरेपी।\n\n🏠 होम विजिट\n📅 अपॉइंटमेंट आधारित" },
    options: [
      { wa: true, en: '📲 Book for Back Pain', hi: '📲 कमर दर्द के लिए बुक करें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I need neurotherapy for Back Pain / Sciatica. Please share details about home visit sessions.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मुझे कमर दर्द / साइटिका के लिए न्यूरोथेरेपी चाहिए।' } },
      { id: 'services', back: true, en: '← All Services', hi: '← सभी सेवाएं' },
    ],
  },
  knee: {
    bot: { en: "🟢 *Knee & Joint Pain*\n\nGentle care focused on knee and joint comfort, helping you maintain mobility at home.\n\n🏠 Home Visit\n📅 Appointment Based", hi: "🟢 *घुटना / जोड़ दर्द*\n\nघर पर घुटने और जोड़ के आराम और गतिशीलता के लिए कोमल देखभाल।\n\n🏠 होम विजिट\n📅 अपॉइंटमेंट आधारित" },
    options: [
      { wa: true, en: '📲 Book for Knee Pain', hi: '📲 घुटने के लिए बुक करें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I need neurotherapy for Knee & Joint Pain. Please share details about home visit sessions.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मुझे घुटने और जोड़ दर्द के लिए न्यूरोथेरेपी चाहिए।' } },
      { id: 'services', back: true, en: '← All Services', hi: '← सभी सेवाएं' },
    ],
  },
  migraine: {
    bot: { en: "🔵 *Migraine / Headache*\n\nSupportive neurotherapy care to help with migraine and headache discomfort, at your home.\n\n🏠 Home Visit\n📅 Appointment Based", hi: "🔵 *माइग्रेन / सिरदर्द*\n\nआपके घर पर माइग्रेन और सिरदर्द की तकलीफ के लिए सहायक देखभाल।\n\n🏠 होम विजिट\n📅 अपॉइंटमेंट आधारित" },
    options: [
      { wa: true, en: '📲 Book for Migraine', hi: '📲 माइग्रेन के लिए बुक करें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I need neurotherapy for Migraine / Headache. Please share details about home visit sessions.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मुझे माइग्रेन / सिरदर्द के लिए न्यूरोथेरेपी चाहिए।' } },
      { id: 'services', back: true, en: '← All Services', hi: '← सभी सेवाएं' },
    ],
  },
  senior: {
    bot: { en: "💜 *Senior Citizen Care*\n\nCompassionate, personalized neurotherapy for senior citizens, delivered with care at their home.\n\n🏠 Home Visit\n📅 Appointment Based", hi: "💜 *वरिष्ठ नागरिक देखभाल*\n\nवरिष्ठ नागरिकों के लिए करुणामय, व्यक्तिगत न्यूरोथेरेपी।\n\n🏠 होम विजिट\n📅 अपॉइंटमेंट आधारित" },
    options: [
      { wa: true, en: '📲 Book for Senior Care', hi: '📲 वरिष्ठ देखभाल बुक करें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I need neurotherapy for a senior family member. Please share details about home visit sessions.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मुझे परिवार के वरिष्ठ सदस्य के लिए न्यूरोथेरेपी चाहिए।' } },
      { id: 'services', back: true, en: '← All Services', hi: '← सभी सेवाएं' },
    ],
  },
  cost: {
    bot: { en: "💰 *Treatment Cost*\n\nCost depends on the type of service and location.\n\nPlease ask Naveen Sharma directly on WhatsApp for exact pricing and session details.", hi: "💰 *उपचार की लागत*\n\nलागत सेवा के प्रकार और स्थान पर निर्भर करती है।\n\nसटीक मूल्य के लिए व्हाट्सएप पर नवीन शर्मा से पूछें।" },
    options: [
      { wa: true, en: '📲 Ask about Cost', hi: '📲 लागत के बारे में पूछें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I would like to know about the cost of neurotherapy home visit sessions. Please share details.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मैं न्यूरोथेरेपी होम विजिट सत्रों की लागत के बारे में जानना चाहता/चाहती हूं।' } },
      { id: 'start', back: true, en: '← Main Menu', hi: '← मुख्य मेनू' },
    ],
  },
  area: {
    bot: { en: "📍 *Service Area*\n\nWe provide *HOME VISIT* neurotherapy in *Bhopal* and surrounding areas.\n\nShare your location on WhatsApp to confirm availability.", hi: "📍 *सेवा क्षेत्र*\n\nहम *भोपाल* और आसपास के क्षेत्रों में *होम विजिट* न्यूरोथेरेपी प्रदान करते हैं।\n\nउपलब्धता की पुष्टि के लिए व्हाट्सएप पर अपना स्थान बताएं।" },
    options: [
      { wa: true, en: '📲 Confirm My Location', hi: '📲 मेरा स्थान बताएं', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I want to confirm if neurotherapy home visit is available in my area. My location: ', hi: 'नमस्ते नवीन शर्मा जी 🙏 मैं जानना चाहता/चाहती हूं कि मेरे क्षेत्र में होम विजिट उपलब्ध है। मेरा स्थान: ' } },
      { id: 'start', back: true, en: '← Main Menu', hi: '← मुख्य मेनू' },
    ],
  },
  connect: {
    bot: { en: "💬 You'll be connected directly to *Neurotherapist Naveen Sharma* on WhatsApp.\n\nHe personally handles all enquiries. 🙏", hi: "💬 आप सीधे *न्यूरोथेरेपिस्ट नवीन शर्मा* से व्हाट्सएप पर जुड़ेंगे।\n\nवे व्यक्तिगत रूप से सभी पूछताछ संभालते हैं। 🙏" },
    options: [
      { wa: true, en: '📲 Open WhatsApp Now', hi: '📲 अभी व्हाट्सएप खोलें', waMsg: { en: 'Hello Naveen Sharma ji 🙏 I found your website and would like to connect regarding neurotherapy home visit services.', hi: 'नमस्ते नवीन शर्मा जी 🙏 मैंने आपकी वेबसाइट देखी और न्यूरोथेरेपी होम विजिट सेवाओं के बारे में बात करना चाहता/चाहती हूं।' } },
      { id: 'start', back: true, en: '← Main Menu', hi: '← मुख्य मेनू' },
    ],
  },
}

// Format bot text — bold *text*, newlines
function BotText({ text }) {
  const lines = text.split('\n')
  return (
    <span>
      {lines.map((line, i) => {
        const parts = line.split(/\*([^*]+)\*/g)
        return (
          <span key={i}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
            {i < lines.length - 1 && <br />}
          </span>
        )
      })}
    </span>
  )
}

const WA_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

export default function WhatsAppBot() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('start')
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [badge, setBadge] = useState(true)
  const bottomRef = useRef(null)
  const { lang } = useLanguage()

  // Init on open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: 'bot', text: TREE.start.bot[lang] || TREE.start.bot.en }])
    }
  }, [open])

  // Scroll to bottom
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [messages, typing])

  const addMessage = (from, text, delay = 0) => {
    setTimeout(() => {
      setMessages(m => [...m, { from, text }])
      if (from === 'bot') setTyping(false)
    }, delay)
  }

  const handleOption = (opt) => {
    const label = opt[lang] || opt.en
    if (opt.back) {
      setMessages(m => [...m, { from: 'user', text: label }])
      const node = TREE[opt.id]
      if (node) {
        setStep(opt.id)
        setTyping(true)
        addMessage('bot', node.bot[lang] || node.bot.en, 500)
      }
      return
    }

    if (opt.wa) {
      setMessages(m => [...m, { from: 'user', text: label }])
      const msg = opt.waMsg ? (opt.waMsg[lang] || opt.waMsg.en) : 'Hello Naveen Sharma ji'
      setTyping(true)
      addMessage('bot', lang === 'hi' ? '✅ व्हाट्सएप खुल रहा है...' : '✅ Opening WhatsApp...', 500)
      setTimeout(() => window.open(waLink(msg), '_blank'), 700)
      return
    }

    const node = TREE[opt.id]
    if (!node) return
    setMessages(m => [...m, { from: 'user', text: label }])
    setStep(opt.id)
    setTyping(true)
    addMessage('bot', node.bot[lang] || node.bot.en, 600)
  }

  const reset = () => {
    setStep('start')
    setTyping(false)
    setMessages([{ from: 'bot', text: TREE.start.bot[lang] || TREE.start.bot.en }])
  }

  const currentNode = TREE[step] || TREE.start
  const isFullscreen = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <>
      {/* ── FLOATING BUTTON ─────────────────────────────────── */}
      <div className="fixed bottom-[76px] md:bottom-6 right-4 z-[60] flex flex-col items-end gap-2">
        {/* Badge tooltip */}
        <AnimatePresence>
          {badge && !open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white border border-green-200 shadow-lg rounded-2xl px-3 py-2 text-[13px] font-semibold text-[#075E54] whitespace-nowrap">
              {lang === 'hi' ? '💬 हमसे बात करें!' : '💬 Chat with us!'}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => { setOpen(o => !o); setBadge(false) }}
          className="relative w-[54px] h-[54px] bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center text-white"
          aria-label="WhatsApp Chat">
          <AnimatePresence mode="wait">
            {open
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={22} /></motion.span>
              : <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>{WA_ICON}</motion.span>
            }
          </AnimatePresence>
          {!open && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
          )}
        </motion.button>
      </div>

      {/* ── CHAT WINDOW ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed z-[59] flex flex-col bg-white overflow-hidden shadow-2xl
              ${isFullscreen
                ? 'inset-x-0 bottom-0 rounded-t-3xl' // mobile: full width, slides up
                : 'bottom-24 right-4 w-[360px] rounded-2xl'
              }`}
            style={{
              height: isFullscreen ? '90vh' : '520px',
              maxHeight: '90vh',
            }}>

            {/* Header */}
            <div className="flex-shrink-0 bg-[#075E54] px-4 py-3 flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 text-white">
                {WA_ICON}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-[14px] leading-tight">Naveen Sharma</p>
                <p className="text-green-300 text-[11px]">Neurotherapist · {lang === 'hi' ? 'ऑनलाइन' : 'Online'}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={reset}
                  className="w-8 h-8 flex items-center justify-center text-green-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="Restart">
                  <RotateCcw size={15} />
                </button>
                <button onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-green-200 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
              style={{ background: '#E5DDD5' }}>
              {/* Date chip */}
              <div className="flex justify-center">
                <span className="bg-white/80 text-[#667781] text-[11px] font-medium px-3 py-0.5 rounded-full shadow-sm">
                  {lang === 'hi' ? 'आज' : 'Today'}
                </span>
              </div>

              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[82%] px-3 py-2 shadow-sm text-[13.5px] leading-relaxed relative ${
                    msg.from === 'user'
                      ? 'bg-[#DCF8C6] text-[#111] rounded-[16px] rounded-tr-[4px]'
                      : 'bg-white text-[#111] rounded-[16px] rounded-tl-[4px]'
                  }`}>
                    <BotText text={msg.text} />
                    <span className={`block text-right text-[10px] mt-1 ${msg.from === 'user' ? 'text-[#667781]' : 'text-[#999]'}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white rounded-[16px] rounded-tl-[4px] px-4 py-3 shadow-sm flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="w-2 h-2 bg-[#999] rounded-full block"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick reply options */}
            {!typing && (
              <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 py-2.5 overflow-y-auto" style={{ maxHeight: '200px' }}>
                <div className="flex flex-col gap-1.5">
                  {currentNode.options?.map((opt, i) => {
                    const label = opt[lang] || opt.en
                    const isBack = opt.back
                    const isWA = opt.wa
                    return (
                      <motion.button key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleOption(opt)}
                        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-left transition-all active:scale-[0.98] ${
                          isWA
                            ? 'bg-[#25D366] text-white shadow-sm'
                            : isBack
                              ? 'bg-gray-50 text-gray-500 border border-gray-200'
                              : 'bg-[#F0F9FF] text-[#075E54] border border-[#c5e8d5]'
                        }`}>
                        <span>{label}</span>
                        {isWA
                          ? <span className="text-white opacity-80">{WA_ICON}</span>
                          : <ChevronRight size={14} className="flex-shrink-0 opacity-50" />
                        }
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
