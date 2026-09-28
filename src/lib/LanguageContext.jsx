import { createContext, useContext, useState, useCallback } from 'react'

const LanguageContext = createContext()

// All Hindi strings use Unicode escapes to avoid encoding issues
// \u0939 = ह, \u093f = ि, \u0902 = ं, \u0926 = द, \u0940 = ी, etc.

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      neurotherapy: 'Neurotherapy',
      services: 'Services',
      benefits: 'Benefits',
      testimonials: 'Testimonials',
      gallery: 'Gallery',
      videos: 'Videos',
      faqs: 'FAQs',
      contact: 'Contact',
      bookAppointment: 'Book Appointment',
      announcements: 'Announcements',
    },
    hero: {
      badge: 'NATURAL \u2022 SAFE \u2022 SUPPORTIVE CARE',
      heading: 'Neurotherapy for Better Movement and Healthier Living',
      subheading: 'Gentle, supportive care designed to support mobility, comfort and overall wellness.',
      btn1: 'Book Appointment', btn2: 'Send Enquiry',
      card1: 'Home Visit Only', card2: 'We Come to Your Home',
      card3: 'Appointment Based', card4: 'Prior Booking Required',
    },
    common: {
      learnMore: 'Learn More', viewAll: 'View All', bookNow: 'Book Now',
      callNow: 'Call Now',
      whatsapp: 'Chat on WhatsApp',
      sendEnquiry: 'Send Enquiry',
      homeVisitOnly: 'Home Visit Only',
      appointmentBased: 'Appointment Based',
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
      quickLinks: 'Quick Links',
      services: 'Services',
      contact: 'Contact',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
    },
  },
  hi: {
    nav: {
      home: '\u0939\u094b\u092e',
      about: '\u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902',
      neurotherapy: '\u0928\u094d\u092f\u0942\u0930\u094b\u0925\u0947\u0930\u0947\u092a\u0940',
      services: '\u0938\u0947\u0935\u093e\u090f\u0902',
      benefits: '\u0932\u093e\u092d',
      testimonials: '\u092a\u094d\u0930\u0936\u0902\u0938\u093e\u092a\u0924\u094d\u0930',
      gallery: '\u0917\u0948\u0932\u0930\u0940',
      videos: '\u0935\u0940\u0921\u093f\u092f\u094b',
      faqs: '\u0938\u093e\u092e\u093e\u0928\u094d\u092f \u092a\u094d\u0930\u0936\u094d\u0928',
      contact: '\u0938\u0902\u092a\u0930\u094d\u0915',
      bookAppointment: '\u0905\u092a\u0949\u0907\u0902\u091f\u092e\u0947\u0902\u091f \u092c\u0941\u0915 \u0915\u0930\u0947\u0902',
      announcements: '\u0938\u0942\u091a\u0928\u093e\u090f\u0902',
    },
    hero: {
      badge: '\u092a\u094d\u0930\u093e\u0915\u0943\u0924\u093f\u0915 \u2022 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u2022 \u0938\u0939\u093e\u092f\u0915 \u0926\u0947\u0916\u092d\u093e\u0932',
      heading: '\u092c\u0947\u0939\u0924\u0930 \u0917\u0924\u093f\u0936\u0940\u0932\u0924\u093e \u0914\u0930 \u0938\u094d\u0935\u0938\u094d\u0925 \u091c\u0940\u0935\u0928 \u0915\u0947 \u0932\u093f\u090f \u0928\u094d\u092f\u0942\u0930\u094b\u0925\u0947\u0930\u0947\u092a\u0940',
      subheading: '\u0926\u0930\u094d\u0926 \u092a\u094d\u0930\u092c\u0902\u0927\u0928, \u0917\u0924\u093f\u0936\u0940\u0932\u0924\u093e \u0914\u0930 \u0938\u092e\u0917\u094d\u0930 \u0935\u0947\u0932\u0928\u0947\u0938 \u0915\u0947 \u0932\u093f\u090f \u0915\u094b\u092e\u0932 \u0926\u0947\u0916\u092d\u093e\u0932\u0964',
      btn1: '\u0905\u092a\u0949\u0907\u0902\u091f\u092e\u0947\u0902\u091f \u092c\u0941\u0915 \u0915\u0930\u0947\u0902',
      btn2: '\u092a\u0942\u091b\u0924\u093e\u091b \u092d\u0947\u091c\u0947\u0902',
      card1: '\u0915\u0947\u0935\u0932 \u0939\u094b\u092e \u0935\u093f\u091c\u093f\u091f',
      card2: '\u0939\u092e \u0906\u092a\u0915\u0947 \u0918\u0930 \u0906\u0924\u0947 \u0939\u0948\u0902',
      card3: '\u0905\u092a\u0949\u0907\u0902\u091f\u092e\u0947\u0902\u091f \u0906\u0927\u093e\u0930\u093f\u0924',
      card4: '\u092a\u0942\u0930\u094d\u0935 \u092c\u0941\u0915\u093f\u0902\u0917 \u0906\u0935\u0936\u094d\u092f\u0915',
    },
    common: {
      learnMore: '\u0905\u0927\u093f\u0915 \u091c\u093e\u0928\u0947\u0902',
      viewAll: '\u0938\u092d\u0940 \u0926\u0947\u0916\u0947\u0902',
      bookNow: '\u0905\u092d\u0940 \u092c\u0941\u0915 \u0915\u0930\u0947\u0902',
      callNow: '\u0905\u092d\u0940 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902',
      whatsapp: '\u0935\u094d\u0939\u093e\u091f\u094d\u0938\u090f\u092a \u092a\u0930 \u091a\u0948\u091f \u0915\u0930\u0947\u0902',
      sendEnquiry: '\u092a\u0942\u091b\u0924\u093e\u091b \u092d\u0947\u091c\u0947\u0902',
      homeVisitOnly: '\u0915\u0947\u0935\u0932 \u0939\u094b\u092e \u0935\u093f\u091c\u093f\u091f',
      appointmentBased: '\u0905\u092a\u0949\u0907\u0902\u091f\u092e\u0947\u0902\u091f \u0906\u0927\u093e\u0930\u093f\u0924',
      noContent: '\u0905\u092d\u0940 \u0915\u094b\u0908 \u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964',
      loading: '\u0932\u094b\u0921 \u0939\u094b \u0930\u0939\u093e \u0939\u0948...',
      submit: '\u091c\u092e\u093e \u0915\u0930\u0947\u0902',
      cancel: '\u0930\u0926\u094d\u0926 \u0915\u0930\u0947\u0902',
      save: '\u0938\u0939\u0947\u091c\u0947\u0902',
      delete: '\u0939\u091f\u093e\u090f\u0902',
      edit: '\u0938\u0902\u092a\u093e\u0926\u093f\u0924 \u0915\u0930\u0947\u0902',
      add: '\u091c\u094b\u0921\u093c\u0947\u0902',
      publish: '\u092a\u094d\u0930\u0915\u093e\u0936\u093f\u0924 \u0915\u0930\u0947\u0902',
      unpublish: '\u0905\u092a\u094d\u0930\u0915\u093e\u0936\u093f\u0924 \u0915\u0930\u0947\u0902',
      status: '\u0938\u094d\u0925\u093f\u0924\u093f',
      actions: '\u0915\u094d\u0930\u093f\u092f\u093e\u090f\u0902',
      confirm: '\u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0930\u0947\u0902',
    },
    appointment: {
      title: '\u0905\u092a\u0949\u0907\u0902\u091f\u092e\u0947\u0902\u091f \u092c\u0941\u0915 \u0915\u0930\u0947\u0902',
      subtitle: '\u0905\u092a\u0928\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u092d\u0930\u0947\u0902 \u0914\u0930 \u0939\u092e \u0906\u092a\u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0917\u0947\u0964',
      name: '\u092a\u0942\u0930\u093e \u0928\u093e\u092e',
      phone: '\u092b\u094b\u0928 \u0928\u0902\u092c\u0930',
      email: '\u0908\u092e\u0947\u0932 (\u0935\u0948\u0915\u0932\u094d\u092a\u093f\u0915)',
      service: '\u0938\u0947\u0935\u093e \u091a\u0941\u0928\u0947\u0902',
      date: '\u092a\u0938\u0902\u0926\u0940\u0926\u093e \u0924\u093f\u0925\u093f',
      time: '\u092a\u0938\u0902\u0926\u0940\u0926\u093e \u0938\u092e\u092f',
      message: '\u0938\u0902\u0926\u0947\u0936 (\u0935\u0948\u0915\u0932\u094d\u092a\u093f\u0915)',
      submit: '\u092a\u0942\u091b\u0924\u093e\u091b \u091c\u092e\u093e \u0915\u0930\u0947\u0902',
      success: '\u0927\u0928\u094d\u092f\u0935\u093e\u0926\u0964 \u0906\u092a\u0915\u0940 \u0905\u092a\u0949\u0907\u0902\u091f\u092e\u0947\u0902\u091f \u092a\u0942\u091b\u0924\u093e\u091b \u092a\u094d\u0930\u093e\u092a\u094d\u0924 \u0939\u094b \u0917\u0908 \u0939\u0948\u0964 \u0939\u092e \u091c\u0932\u094d\u0926 \u0906\u092a\u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0917\u0947\u0964',
      required: '\u092f\u0939 \u092b\u093c\u0940\u0932\u094d\u0921 \u0906\u0935\u0936\u094d\u092f\u0915 \u0939\u0948',
    },
    testimonial: {
      shareTitle: '\u0905\u092a\u0928\u093e \u0905\u0928\u0941\u092d\u0935 \u0938\u093e\u091d\u093e \u0915\u0930\u0947\u0902',
      shareSubtitle: '\u0906\u092a\u0915\u0940 \u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e \u0926\u0942\u0938\u0930\u094b\u0902 \u0915\u0940 \u092e\u0926\u0926 \u0915\u0930\u0924\u0940 \u0939\u0948\u0964',
      name: '\u0906\u092a\u0915\u093e \u0928\u093e\u092e',
      email: '\u0908\u092e\u0947\u0932 (\u0935\u0948\u0915\u0932\u094d\u092a\u093f\u0915)',
      phone: '\u092b\u094b\u0928 (\u0935\u0948\u0915\u0932\u094d\u092a\u093f\u0915)',
      feedback: '\u0906\u092a\u0915\u0940 \u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e',
      rating: '\u0930\u0947\u091f\u093f\u0902\u0917 (\u0935\u0948\u0915\u0932\u094d\u092a\u093f\u0915)',
      submit: '\u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e \u091c\u092e\u093e \u0915\u0930\u0947\u0902',
      success: '\u0927\u0928\u094d\u092f\u0935\u093e\u0926\u0964 \u092a\u094d\u0930\u0915\u093e\u0936\u093f\u0924 \u0939\u094b\u0928\u0947 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0906\u092a\u0915\u0940 \u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e \u0915\u0940 \u0938\u092e\u0940\u0915\u094d\u0937\u093e \u0915\u0940 \u091c\u093e\u090f\u0917\u0940\u0964',
    },
    footer: {
      quickLinks: '\u0924\u094d\u0935\u0930\u093f\u0924 \u0932\u093f\u0902\u0915',
      services: '\u0938\u0947\u0935\u093e\u090f\u0902',
      contact: '\u0938\u0902\u092a\u0930\u094d\u0915',
      followUs: '\u0939\u092e\u0947\u0902 \u092b\u0949\u0932\u094b \u0915\u0930\u0947\u0902',
      rights: '\u0938\u0930\u094d\u0935\u093e\u0927\u093f\u0915\u093e\u0930 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924\u0964',
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
