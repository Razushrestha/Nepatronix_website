import { client } from "@/sanity/lib/client";

interface FooterData {
  companyName: string;
  tagline: string;
  description: string;
  contactInfo: {
    address: string;
    postalCode: string;
    weekdayHours: string;
    weekendHours: string;
  };
  quickLinks?: {
    name: string;
    href: string;
  }[];
  expertise: {
    name: string;
    desc: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  copyrightText: string;
}

function SocialIcon({ platform }: { platform: string }) {
  const key = platform?.toLowerCase();

  if (key?.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.87 6.48 1.87 12.07c0 5 3.66 9.14 8.44 9.93v-7.03H7.9V12.1h2.4V9.83c0-2.38 1.42-3.69 3.6-3.69 1.04 0 2.13.19 2.13.19v2.35h-1.2c-1.18 0-1.55.73-1.55 1.48v1.75h2.64l-.42 2.87h-2.22v7.03c4.78-.79 8.44-4.93 8.44-9.93Z" />
      </svg>
    );
  }

  if (key?.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.55v-5.29c0-1.26-.02-2.88-1.76-2.88-1.76 0-2.03 1.37-2.03 2.79v5.38h-3.55V9h3.41v1.56h.05c.48-.9 1.66-1.85 3.41-1.85 3.65 0 4.32 2.4 4.32 5.51v6.23ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm-1.78 13.02h3.55V9H3.56v11.45Z" />
      </svg>
    );
  }

  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export async function Footer() {
  const query = `*[_type == "footer"][0]`;
  const footerData: FooterData | null = await client.fetch(
    query,
    {},
    { next: { revalidate: 60 } }
  );

  if (!footerData) {
    // Fallback if data is not present
    return null; 
  }

  return (
    <footer className="relative bg-[#020617] text-white overflow-hidden border-t border-white/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(white_0.5px,transparent_0.5px)] bg-[length:30px_30px]"></div>
      
      {/* Decorative Brand Blurs */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 h-128 w-128 rounded-full bg-[#C1121F]/10 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-128 w-128 rounded-full bg-blue-500/10 blur-[120px]"></div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Main Footer Content */}
        <div className="grid gap-x-12 gap-y-16 py-24 grid-cols-2 lg:grid-cols-4">
          
          {/* Company Brand */}
          <div className="col-span-2 md:col-span-1 space-y-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {footerData.companyName}
                </h3>
                <p className="text-[10px] font-black text-[#C1121F] tracking-[0.4em] uppercase">{footerData.tagline}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 max-w-sm font-medium">
                {footerData.description}
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="grid gap-6">
              <div className="flex items-start gap-4 group">
                 <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C1121F] border border-white/10 transition-all group-hover:bg-[#C1121F] group-hover:text-white group-hover:-translate-y-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-white tracking-tight">{footerData.contactInfo?.address}</p>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{footerData.contactInfo?.postalCode}</p>
                 </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                 <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C1121F] border border-white/10 transition-all group-hover:bg-[#C1121F] group-hover:text-white group-hover:-translate-y-1">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-white tracking-tight">{footerData.contactInfo?.weekdayHours}</p>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{footerData.contactInfo?.weekendHours}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="col-span-1 space-y-8">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] relative inline-block">
              Quick Links
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#C1121F] rounded-full"></span>
            </h4>

            <nav className="flex flex-col gap-4">
              {footerData.quickLinks?.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="group flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-white transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#C1121F] transition-all"></span>
                  <span className="leading-tight tracking-tight">{link.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Services Showcase */}
          <div className="col-span-1 space-y-8">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] relative inline-block">
              Our Expertise
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#C1121F] rounded-full"></span>
            </h4>
            
            <div className="space-y-6">
              {footerData.expertise?.map((service, i) => (
                <div key={i} className="group cursor-default space-y-1">
                  <h5 className="text-sm font-bold text-white group-hover:text-[#C1121F] transition-colors leading-tight tracking-tight">
                    {service.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-1">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Connect & Socials */}
          <div className="col-span-2 md:col-span-1 space-y-8">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] relative inline-block">
              Connect With Us
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#C1121F] rounded-full"></span>
            </h4>

            <div className="space-y-8">
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Follow us on social media for daily updates and student spotlights.
              </p>

              <div className="flex flex-wrap gap-4">
                {footerData.socialLinks?.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#C1121F] hover:text-white hover:border-transparent transition-all duration-300 transform hover:-translate-y-1"
                    aria-label={social.platform}
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/5 py-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
               © {new Date().getFullYear()} All rights reserved by {footerData.companyName}.
            </p>
            
            <div className="flex items-center gap-4">
              {footerData.socialLinks?.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
               <span>Made with</span>
               <svg className="w-3.5 h-3.5 text-[#C1121F] animate-pulse fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
               <span>in Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
