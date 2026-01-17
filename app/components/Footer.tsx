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

export async function Footer() {
  const query = `*[_type == "footer"][0]`;
  const footerData: FooterData | null = await client.fetch(query);

  if (!footerData) {
    // Fallback if data is not present
    return null; 
  }

  return (
    <footer className="relative bg-[#020617] text-white overflow-hidden border-t border-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
      
      {/* Decorative Brand Blurs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-[500px] w-[500px] rounded-full bg-[#C1121F]/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-[500px] w-[500px] rounded-full bg-slate-800/20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Main Footer Content */}
        <div className="grid gap-x-8 gap-y-12 py-16 grid-cols-2 lg:grid-cols-4">
          
          {/* Company Brand */}
          <div className="col-span-2 md:col-span-1 space-y-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {footerData.companyName}
                </h3>
                <p className="text-sm font-medium text-[#C1121F] tracking-wide uppercase">{footerData.tagline}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                {footerData.description}
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                 <div className="mt-1 w-5 h-5 text-[#C1121F]">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-sm font-medium text-white">{footerData.contactInfo?.address}</p>
                    <p className="text-xs text-slate-500">{footerData.contactInfo?.postalCode}</p>
                 </div>
              </div>
              
              <div className="flex items-start gap-3">
                 <div className="mt-1 w-5 h-5 text-[#C1121F]">
                   <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-sm font-medium text-white">{footerData.contactInfo?.weekdayHours}</p>
                    <p className="text-xs text-slate-500">{footerData.contactInfo?.weekendHours}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation - REMOVED */}

          {/* Services Showcase */}
          <div className="col-span-1 space-y-6">
            <h4 className="text-lg font-bold text-white relative inline-block">
              Our Expertise
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#C1121F] rounded-full"></span>
            </h4>
            
            <div className="space-y-4">
              {footerData.expertise?.map((service, i) => (
                <div key={i} className="group cursor-default">
                  <h5 className="text-sm font-medium text-white group-hover:text-[#C1121F] transition-colors leading-tight">
                    {service.name}
                  </h5>
                  <p className="text-xs text-slate-500 group-hover:text-slate-400 hidden sm:block mt-0.5">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Connect & Newsletter */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <h4 className="text-lg font-bold text-white relative inline-block">
              Stay Connected
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#C1121F] rounded-full"></span>
            </h4>

            {/* Contact Methods */}
            <div className="space-y-6">
              
              {/* Newsletter */}
              <div className="space-y-3 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                <p className="text-xs font-semibold text-white uppercase tracking-wider">Subscribe to Newsletter</p>
                <div className="flex flex-col space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#C1121F] focus:ring-1 focus:ring-[#C1121F] focus:outline-none transition-all"
                  />
                  <button className="w-full rounded-lg bg-[#C1121F] px-3 py-2 text-sm font-bold text-white transition-all hover:bg-[#A30F19] hover:shadow-[0_0_20px_rgba(193,18,31,0.3)]">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left space-y-1">
              <p className="text-sm text-slate-500">
                 {new Date().getFullYear()} {footerData.copyrightText || footerData.companyName}. All rights reserved.
              </p>
            </div>
            
             {/* Social Links Bottom */}
             <div className="flex space-x-4">
                  {footerData.socialLinks?.map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#C1121F] hover:text-white transition-all duration-300 hover:-translate-y-1"
                      aria-label={social.platform}
                    >
                      {/* Placeholder Icon */}
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                          <circle cx="12" cy="12" r="10" />
                      </svg>
                    </a>
                  ))}
            </div>

            <div className="text-sm text-slate-500 font-medium">
              Made with <span className="text-[#C1121F]"></span> in Nepal
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
