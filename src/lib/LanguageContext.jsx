import { createContext, useContext, useState, useCallback } from 'react'

const LanguageContext = createContext()

export const translations = {
  en: {
    nav: {
      home: 'Home', about: 'About', neurotherapy: 'Neurotherapy',
      services: 'Services', benefits: 'Benefits', testimonials: 'Testimonials',
      gallery: 'Gallery', videos: 'Videos', faqs: 'FAQs', contact: 'Contact',
      bookAppointment: 'Book Appointment',
    },
    hero: {
      badge: 'NATURAL â€¢ SAFE â€¢ SUPPORTIVE CARE',
      heading: 'Neurotherapy for Better Movement and Healthier Living',
      subheading: 'Gentle, supportive care designed to support mobility, comfort and overall wellness.',
      btn1: 'Book Appointment', btn2: 'Send Enquiry',
      card1: 'Home Visit Only', card2: 'We Come to Your Home',
      card3: 'Appointment Based', card4: 'Prior Booking Required',
    },
    common: {
      learnMore: 'Learn More', viewAll: 'View All', bookNow: 'Book Now',
      callNow: 'Call Now', whatsapp: 'Chat on WhatsApp', sendEnquiry: 'Send Enquiry',
      homeVisitOnly: 'Home Visit Only', appointmentBased: 'Appointment Based',
      noContent: 'No content available at the moment.',
      loading: 'Loading...', submit: 'Submit', cancel: 'Cancel',
      save: 'Save', delete: 'Delete', edit: 'Edit', add: 'Add',
      publish: 'Publish', unpublish: 'Unpublish', status: 'Status',
      actions: 'Actions', confirm: 'Confirm',
    },
    appointment: {
      title: 'Book an Appointment',
      subtitle: 'Fill in your details and we will contact you to confirm your home visit appointment.',
      name: 'Full Name', phone: 'Phone Number', email: 'Email (Optional)',
      service: 'Select Service', date: 'Preferred Date', time: 'Preferred Time',
      message: 'Message (Optional)', submit: 'Submit Enquiry',
      success: 'Thank you. Your appointment enquiry has been received. We will contact you soon.',
      required: 'This field is required',
    },
    testimonial: {
      shareTitle: 'Share Your Experience',
      shareSubtitle: 'Your feedback helps others learn about our wellness support.',
      name: 'Your Name', email: 'Email (Optional)', phone: 'Phone (Optional)',
      feedback: 'Your Feedback / Testimonial', rating: 'Rating (Optional)',
      submit: 'Submit Feedback',
      success: 'Thank you for sharing your feedback. Your submission will be reviewed before being published.',
    },
    footer: {
      quickLinks: 'Quick Links', services: 'Services', contact: 'Contact',
      followUs: 'Follow Us', rights: 'All rights reserved.',
    },
  },
  hi: {
    nav: {
      home: 'à¤¹à¥‹à¤®', about: 'à¤¹à¤®à¤¾à¤°à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚', neurotherapy: 'à¤¨à¥à¤¯à¥‚à¤°à¥‹à¤¥à¥‡à¤°à¥‡à¤ªà¥€',
      services: 'à¤¸à¥‡à¤µà¤¾à¤à¤‚', benefits: 'à¤²à¤¾à¤­', testimonials: 'à¤ªà¥à¤°à¤¶à¤‚à¤¸à¤¾à¤ªà¤¤à¥à¤°',
      gallery: 'à¤—à¥ˆà¤²à¤°à¥€', videos: 'à¤µà¥€à¤¡à¤¿à¤¯à¥‹', faqs: 'à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤ªà¥à¤°à¤¶à¥à¤¨', contact: 'à¤¸à¤‚à¤ªà¤°à¥à¤•',
      bookAppointment: 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚',
    },
    hero: {
      badge: 'à¤ªà¥à¤°à¤¾à¤•à¥ƒà¤¤à¤¿à¤• â€¢ à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ â€¢ à¤¸à¤¹à¤¾à¤¯à¤• à¤¦à¥‡à¤–à¤­à¤¾à¤²',
      heading: 'à¤¬à¥‡à¤¹à¤¤à¤° à¤—à¤¤à¤¿à¤¶à¥€à¤²à¤¤à¤¾ à¤”à¤° à¤¸à¥à¤µà¤¸à¥à¤¥ à¤œà¥€à¤µà¤¨ à¤•à¥‡ à¤²à¤¿à¤ à¤¨à¥à¤¯à¥‚à¤°à¥‹à¤¥à¥‡à¤°à¥‡à¤ªà¥€',
      subheading: 'à¤—à¤¤à¤¿à¤¶à¥€à¤²à¤¤à¤¾, à¤†à¤°à¤¾à¤® à¤”à¤° à¤¸à¤®à¤—à¥à¤° à¤•à¤²à¥à¤¯à¤¾à¤£ à¤•à¤¾ à¤¸à¤®à¤°à¥à¤¥à¤¨ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤•à¥‹à¤®à¤², à¤¸à¤¹à¤¾à¤¯à¤• à¤¦à¥‡à¤–à¤­à¤¾à¤²à¥¤',
      btn1: 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚', btn2: 'à¤ªà¥‚à¤›à¤¤à¤¾à¤› à¤­à¥‡à¤œà¥‡à¤‚',
      card1: 'à¤•à¥‡à¤µà¤² à¤¹à¥‹à¤® à¤µà¤¿à¤œà¤¿à¤Ÿ', card2: 'à¤¹à¤® à¤†à¤ªà¤•à¥‡ à¤˜à¤° à¤†à¤¤à¥‡ à¤¹à¥ˆà¤‚',
      card3: 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤†à¤§à¤¾à¤°à¤¿à¤¤', card4: 'à¤ªà¥‚à¤°à¥à¤µ à¤¬à¥à¤•à¤¿à¤‚à¤— à¤†à¤µà¤¶à¥à¤¯à¤•',
    },
    common: {
      learnMore: 'à¤…à¤§à¤¿à¤• à¤œà¤¾à¤¨à¥‡à¤‚', viewAll: 'à¤¸à¤­à¥€ à¤¦à¥‡à¤–à¥‡à¤‚', bookNow: 'à¤…à¤­à¥€ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚',
      callNow: 'à¤…à¤­à¥€ à¤•à¥‰à¤² à¤•à¤°à¥‡à¤‚', whatsapp: 'à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤ªà¤° à¤šà¥ˆà¤Ÿ à¤•à¤°à¥‡à¤‚', sendEnquiry: 'à¤ªà¥‚à¤›à¤¤à¤¾à¤› à¤­à¥‡à¤œà¥‡à¤‚',
      homeVisitOnly: 'à¤•à¥‡à¤µà¤² à¤¹à¥‹à¤® à¤µà¤¿à¤œà¤¿à¤Ÿ', appointmentBased: 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤†à¤§à¤¾à¤°à¤¿à¤¤',
      noContent: 'à¤…à¤­à¥€ à¤•à¥‹à¤ˆ à¤¸à¤¾à¤®à¤—à¥à¤°à¥€ à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤',
      loading: 'à¤²à¥‹à¤¡ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ...', submit: 'à¤œà¤®à¤¾ à¤•à¤°à¥‡à¤‚', cancel: 'à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚',
      save: 'à¤¸à¤¹à¥‡à¤œà¥‡à¤‚', delete: 'à¤¹à¤Ÿà¤¾à¤à¤‚', edit: 'à¤¸à¤‚à¤ªà¤¾à¤¦à¤¿à¤¤ à¤•à¤°à¥‡à¤‚', add: 'à¤œà¥‹à¤¡à¤¼à¥‡à¤‚',
      publish: 'à¤ªà¥à¤°à¤•à¤¾à¤¶à¤¿à¤¤ à¤•à¤°à¥‡à¤‚', unpublish: 'à¤…à¤ªà¥à¤°à¤•à¤¾à¤¶à¤¿à¤¤ à¤•à¤°à¥‡à¤‚', status: 'à¤¸à¥à¤¥à¤¿à¤¤à¤¿',
      actions: 'à¤•à¥à¤°à¤¿à¤¯à¤¾à¤à¤‚', confirm: 'à¤ªà¥à¤·à¥à¤Ÿà¤¿ à¤•à¤°à¥‡à¤‚',
    },
    appointment: {
      title: 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚',
      subtitle: 'à¤…à¤ªà¤¨à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤­à¤°à¥‡à¤‚ à¤”à¤° à¤¹à¤® à¤†à¤ªà¤•à¥‡ à¤¹à¥‹à¤® à¤µà¤¿à¤œà¤¿à¤Ÿ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤•à¥€ à¤ªà¥à¤·à¥à¤Ÿà¤¿ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¤—à¥‡à¥¤',
      name: 'à¤ªà¥‚à¤°à¤¾ à¤¨à¤¾à¤®', phone: 'à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°', email: 'à¤ˆà¤®à¥‡à¤² (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)',
      service: 'à¤¸à¥‡à¤µà¤¾ à¤šà¥à¤¨à¥‡à¤‚', date: 'à¤ªà¤¸à¤‚à¤¦à¥€à¤¦à¤¾ à¤¤à¤¿à¤¥à¤¿', time: 'à¤ªà¤¸à¤‚à¤¦à¥€à¤¦à¤¾ à¤¸à¤®à¤¯',
      message: 'à¤¸à¤‚à¤¦à¥‡à¤¶ (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)', submit: 'à¤ªà¥‚à¤›à¤¤à¤¾à¤› à¤œà¤®à¤¾ à¤•à¤°à¥‡à¤‚',
      success: 'à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤†à¤ªà¤•à¥€ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤ªà¥‚à¤›à¤¤à¤¾à¤› à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥‹ à¤—à¤ˆ à¤¹à¥ˆà¥¤ à¤¹à¤® à¤œà¤²à¥à¤¦ à¤¹à¥€ à¤†à¤ªà¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¤—à¥‡à¥¤',
      required: 'à¤¯à¤¹ à¤«à¤¼à¥€à¤²à¥à¤¡ à¤†à¤µà¤¶à¥à¤¯à¤• à¤¹à¥ˆ',
    },
    testimonial: {
      shareTitle: 'à¤…à¤ªà¤¨à¤¾ à¤…à¤¨à¥à¤­à¤µ à¤¸à¤¾à¤à¤¾ à¤•à¤°à¥‡à¤‚',
      shareSubtitle: 'à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤¦à¥‚à¤¸à¤°à¥‹à¤‚ à¤•à¥‹ à¤¹à¤®à¤¾à¤°à¥€ à¤µà¥‡à¤²à¤¨à¥‡à¤¸ à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤œà¤¾à¤¨à¤¨à¥‡ à¤®à¥‡à¤‚ à¤®à¤¦à¤¦ à¤•à¤°à¤¤à¥€ à¤¹à¥ˆà¥¤',
      name: 'à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤®', email: 'à¤ˆà¤®à¥‡à¤² (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)', phone: 'à¤«à¥‹à¤¨ (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)',
      feedback: 'à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ / à¤ªà¥à¤°à¤¶à¤‚à¤¸à¤¾à¤ªà¤¤à¥à¤°', rating: 'à¤°à¥‡à¤Ÿà¤¿à¤‚à¤— (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)',
      submit: 'à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤œà¤®à¤¾ à¤•à¤°à¥‡à¤‚',
      success: 'à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤¸à¤¾à¤à¤¾ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦à¥¤ à¤ªà¥à¤°à¤•à¤¾à¤¶à¤¿à¤¤ à¤¹à¥‹à¤¨à¥‡ à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡ à¤†à¤ªà¤•à¥€ à¤¸à¤¬à¤®à¤¿à¤¶à¤¨ à¤•à¥€ à¤¸à¤®à¥€à¤•à¥à¤·à¤¾ à¤•à¥€ à¤œà¤¾à¤à¤—à¥€à¥¤',
    },
    footer: {
      quickLinks: 'à¤¤à¥à¤µà¤°à¤¿à¤¤ à¤²à¤¿à¤‚à¤•', services: 'à¤¸à¥‡à¤µà¤¾à¤à¤‚', contact: 'à¤¸à¤‚à¤ªà¤°à¥à¤•',
      followUs: 'à¤¹à¤®à¥‡à¤‚ à¤«à¥‰à¤²à¥‹ à¤•à¤°à¥‡à¤‚', rights: 'à¤¸à¤°à¥à¤µà¤¾à¤§à¤¿à¤•à¤¾à¤° à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤à¥¤',
    },
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'hi')

  const switchLang = useCallback((l) => {
    setLang(l)
    localStorage.setItem('lang', l)
  }, [])

  const t = translations[lang] || translations.hi

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}


