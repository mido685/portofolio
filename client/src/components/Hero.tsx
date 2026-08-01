import { motion } from "framer-motion";

export default function Hero() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center px-4 pt-24 pb-12 overflow-hidden"
      style={{
        backgroundImage: "url(/manus-storage/stark-ai-hero-bg_b5ce11f9.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0a0e1a]/80" />

      <div className="relative z-10 container max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
        {/* Left: Logo + Title + Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/stark-logo-poster.png"
              className="w-24 h-24 rounded-full border-2 border-[#00d4aa] object-contain bg-[#0a0e1a]"
            >
              <source src="/assets/stark-logo.webm" type="video/webm" />
              <source src="/assets/stark-logo.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-[#00d4aa] text-glow tracking-wider mb-4 font-stencil"
          >
            STARK AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 font-mono-data tracking-[0.3em] uppercase mb-10 font-stencil"
          >
            Intelligent Systems
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-300 text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
          >
            I design and develop real-world AI systems including chatbots, RAG pipelines,
            and cost intelligence tools that help businesses reduce errors, automate workflows,
            and make faster decisions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
          >
            <button
              onClick={() => handleNavClick("#projects")}
              className="px-6 py-3 bg-[#00d4aa] text-[#0a0e1a] font-semibold rounded-lg hover:bg-[#00e5bb] transition-all duration-200 active:scale-[0.97]"
            >
              View Projects
            </button>
            <button
              onClick={() => handleNavClick("#contact")}
              className="px-6 py-3 border-2 border-[#00d4aa] text-[#00d4aa] font-semibold rounded-lg hover:bg-[#00d4aa]/10 transition-all duration-200 active:scale-[0.97]"
            >
              Contact Us
            </button>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
              className="px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-[#00d4aa] hover:text-[#00d4aa] transition-all duration-200 active:scale-[0.97]"
            >
              Download CV
            </a>
          </motion.div>

          {/* Stats line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm text-gray-500 font-mono-data"
          >
            ⚡ Built production AI systems for inventory intelligence, costing automation, and NLP chatbots
          </motion.p>
        </div>

        {/* Right: Founder Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#111827]/80 backdrop-blur-sm border border-[#00d4aa]/20 rounded-2xl p-8 flex flex-col items-center text-center gap-4 card-glow"
        >
          {/* Enlarged photo with layered glow effects */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* Outer pulsing glow */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[#00d4aa] blur-3xl"
            />

            {/* Rotating dashed ring */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="#00d4aa"
                strokeWidth="1.5"
                strokeDasharray="10 8"
                opacity="0.6"
              />
            </motion.svg>

            {/* Counter-rotating thin ring */}
            <motion.svg
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="#00d4aa"
                strokeWidth="0.75"
                strokeDasharray="2 6"
                opacity="0.4"
              />
            </motion.svg>

            {/* Dot grid accent */}
            <svg
              className="absolute -top-2 -left-4 w-16 h-16 opacity-60 pointer-events-none"
              viewBox="0 0 60 60"
              fill="none"
            >
              {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 4 }).map((_, col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={8 + col * 14}
                    cy={8 + row * 14}
                    r="2"
                    fill="#00d4aa"
                  />
                ))
              )}
            </svg>

            {/* Photo */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
              className="relative w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-[3px] border-[#00d4aa] shadow-[0_0_45px_rgba(0,212,170,0.55)]"
            >
              <img
                src="/images/WhatsApp Image 2026-03-25 at 22.56.35.jpeg"
                alt="Mohamed Ibrahim"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Mohamed Ibrahim</h3>
            <p className="text-[#00d4aa] text-sm font-mono-data uppercase tracking-wide mb-3">
              AI Engineer & Founder
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Specializing in Natural Language Processing, intelligent systems design, and
              AI-powered assistant development — bridging cutting-edge AI research with
              practical business applications.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}