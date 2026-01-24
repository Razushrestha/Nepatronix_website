import { ourServices } from "../data";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#020617] py-24 sm:py-32 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Our Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Comprehensive technology and education solutions tailored for excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ourServices.map((service) => (
              <Link 
                key={service.id} 
                href={`/services/${service.id}`}
                className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-[0_4px_20px_rgba(193,18,31,0.15)] hover:border-[#C1121F] hover:-translate-y-1 block h-full"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C1121F]/10 text-[#C1121F] shadow-sm group-hover:bg-[#C1121F] group-hover:text-white transition-colors">
                   <span className="text-2xl" role="img" aria-label={service.title}>
                     {service.icon}
                   </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold tracking-tight text-[#020617] group-hover:text-[#C1121F] transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">
                    {service.description}
                  </p>
                </div>
                
                <div className="mt-2 flex items-center text-sm font-semibold text-[#C1121F] group-hover:text-[#A30F19]">
                  Read more <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Simple CTA */}
       <section className="bg-[#020617] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Partner with Us
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Let's discuss how we can help transform your organization with our specialized services.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/contact" className="rounded-full bg-[#C1121F] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(193,18,31,0.39)] hover:bg-[#E63946] hover:shadow-[0_6px_20px_rgba(193,18,31,0.23)] transition-all">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}