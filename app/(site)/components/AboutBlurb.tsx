/**
 * Answer-first "About Nepatronix" block — designed to be quoted verbatim by
 * AI answer engines (ChatGPT, Perplexity, Google AI Overviews). Every sentence
 * is a factual, atomic answer.
 */
export function AboutBlurb() {
  return (
    <section
      id="about-nepatronix"
      className="mx-auto max-w-4xl px-6 py-16"
      aria-label="About Nepatronix"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <p className="text-xs font-bold text-[#C1121F] uppercase tracking-[0.3em] mb-4">
          About Nepatronix
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#020617] tracking-tight mb-6">
          Nepatronix in one paragraph
        </h2>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          <strong>Nepatronix Engineering Solutions</strong> is a Nepal-based STEM education and
          engineering company founded in <strong>2021</strong>, headquartered in
          <strong> Kupondole, Lalitpur</strong>. Nepatronix trains students and teachers in{" "}
          <strong>IoT, robotics, Arduino, ESP32 and PCB design</strong>, sets up
          <strong> STEM labs for schools</strong>, and builds custom software and IoT hardware
          through its <strong>Meta-Tronix</strong> vertical. Selected programs are aligned with
          <strong> IIT Madras SWAYAM Plus and NCrF Level 4.5</strong>, and every graduate
          receives a certificate with a public verification link.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Headquarters
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">Kupondole, Lalitpur, Nepal</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Founded</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">2021</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Core focus
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">
              STEM, IoT, Robotics, Engineering
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">
              info@nepatronix.org · +977-9803661701
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
