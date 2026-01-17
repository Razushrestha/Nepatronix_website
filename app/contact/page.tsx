"use client";

import { client } from "@/sanity/lib/client";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

// Define interface based on your Sanity schema
interface ContactPageData {
  pageTitle: string;
  pageDescription: string;
  contactDetails: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  formTitle: string;
  formSubtitle: string;
  socialMedia: {
    platform: string;
    url: string;
  }[];
}

export default function ContactPage() {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Fetch data from Sanity
  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == "contact"][0]`;
      const result = await client.fetch<ContactPageData>(query);
      setData(result);
    };
    fetchData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };

  if (!data) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-[#020617] py-20 sm:py-24 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-[#C1121F]/10 mb-6 border border-[#C1121F]/20 text-[#C1121F] text-xs font-bold uppercase tracking-widest">
                Get in Touch
            </span>
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl">{data.pageTitle}</h1>
          <p className="mt-6 text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {data.pageDescription}
          </p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="relative -mt-12 pb-12 z-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
            label: 'Email',
            value: data.contactDetails?.email,
            href: `mailto:${data.contactDetails?.email}`,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            )
          }, {
            label: 'Call',
            value: data.contactDetails?.phone,
            href: `tel:${data.contactDetails?.phone}`,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            )
          }, {
            label: 'Visit',
            value: data.contactDetails?.address,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )
          }, {
            label: 'Hours',
            value: data.contactDetails?.hours,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
          }].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-100 bg-white px-6 py-6 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center sm:items-start sm:text-left gap-4 hover:-translate-y-1 transition-transform duration-300">
               <div className="p-3 bg-blue-50 text-[#020617] rounded-xl group-hover:bg-[#C1121F] group-hover:text-white transition-colors">
                   {item.icon}
               </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">{item.label}</p>
                {item.href ? (
                    <a href={item.href} className="block text-base font-bold text-[#020617] hover:text-[#C1121F] transition-colors">
                    {item.value}
                    </a>
                ) : (
                    <p className="text-base font-bold text-[#020617]">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + info */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
              <h2 className="text-3xl font-extrabold text-[#020617]">{data.formTitle}</h2>
              <p className="mt-2 text-slate-600">{data.formSubtitle}</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-[#020617]">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[#020617] focus:border-[#C1121F] focus:bg-white focus:ring-0 transition-all outline-none"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-[#020617]">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[#020617] focus:border-[#C1121F] focus:bg-white focus:ring-0 transition-all outline-none"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-[#020617]">Phone number</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[#020617] focus:border-[#C1121F] focus:bg-white focus:ring-0 transition-all outline-none"
                    placeholder="+977 (984) 000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-[#020617]">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-[#020617] focus:border-[#C1121F] focus:bg-white focus:ring-0 transition-all outline-none resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#C1121F] px-8 py-4 text-base font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-[#A30F19] hover:-translate-y-1 active:scale-95 sm:w-auto"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Contact Info / Map / Socials */}
            <div className="space-y-8">
               {/* Map Placeholder */}
               <div className="rounded-3xl border border-slate-100 bg-slate-200 h-64 w-full relative overflow-hidden group">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1565.3426804576394!2d85.33230689912068!3d27.69339023689405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a0026e63df%3A0xc3927d7301c609c2!2sNew%20Baneshwor%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    className="grayscale group-hover:grayscale-0 transition-all duration-700"
                  ></iframe>
               </div>

               {/* Socials */}
               <div className="rounded-3xl border border-slate-100 bg-white p-8">
                  <h3 className="text-xl font-bold text-[#020617] mb-6">Follow us</h3>
                  <div className="flex flex-wrap gap-4">
                     {data.socialMedia?.map((social, i) => (
                        <a 
                          key={i} 
                          href={social.url} 
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#C1121F]/20 hover:bg-[#C1121F]/5 transition-all group"
                        >
                            <span className="font-semibold text-slate-600 group-hover:text-[#C1121F]">{social.platform}</span>
                        </a>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
