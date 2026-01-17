import { ourServices } from "../../data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const service = ourServices.find((s) => s.id === params.id);
  
  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }
 
  return {
    title: `${service.title} | Nepatronix`,
    description: service.description,
  };
}

export function generateStaticParams() {
  return ourServices.map((service) => ({
    id: service.id,
  }));
}

export default function ServiceDetail({ params }: { params: { id: string } }) {
  const service = ourServices.find((s) => s.id === params.id);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F8FAFF] to-white">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/services" 
            className="inline-flex items-center text-sm font-semibold text-[#5F6C7B] hover:text-[#0B3C74] mb-8 transition-colors"
          >
            ← Back to Services
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F8FAFF] border border-[#E6EBF2] text-4xl mb-6">
                 {service.icon === 'microscope' && '🔬'}
                 {service.icon === 'chip' && '⚙️'}
                 {service.icon === 'lab' && '🏗️'}
                 {service.icon === 'code' && '💻'}
               </div>
               <h1 className="text-4xl md:text-5xl font-bold text-[#0B3C74] mb-6">
                 {service.title}
               </h1>
               <div className="h-1.5 w-24 bg-[#C4161C] rounded-full mb-8"></div>
               <p className="text-xl text-[#5F6C7B] leading-relaxed">
                 {service.description}
               </p>
            </div>
            
            {/* Visual Element */}
            <div className="relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B3C74] to-[#1a4f8b] shadow-xl">
               <div className="absolute inset-0 flex items-center justify-center text-white/20 text-9xl font-black">
                 {service.icon === 'microscope' && '🔬'}
                 {service.icon === 'chip' && '⚙️'}
                 {service.icon === 'lab' && '🏗️'}
                 {service.icon === 'code' && '💻'}
               </div>
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Scope of Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#0B3C74] mb-4">Scope of Services</h2>
              <div className="h-1 w-16 bg-[#C4161C] rounded-full mx-auto"></div>
              <p className="max-w-2xl mx-auto text-[#5F6C7B] mt-6">
                Comprehensive solutions tailored to meet your specific needs and requirements.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.scopeOfServices.map((scope, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-6 bg-[#F8FAFF] rounded-xl border border-[#E6EBF2] hover:shadow-md transition-all duration-300"
                >
                   <div className="w-10 h-10 rounded-full bg-[#0B3C74] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                     {index + 1}
                   </div>
                   <div className="flex-1">
                     <h3 className="font-semibold text-[#0B3C74] mb-1">{scope}</h3>
                     <div className="w-12 h-0.5 bg-[#C4161C] rounded-full"></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B3C74] text-white text-center">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how our {service.title.toLowerCase()} can help transform your organization.
            </p>
            <Link 
              href="/contact" 
              className="inline-block px-8 py-4 bg-[#C4161C] text-white font-semibold rounded-lg hover:bg-[#a01217] transition-all shadow-lg"
            >
              Contact Us Today
            </Link>
         </div>
      </section>

    </main>
  );
}
