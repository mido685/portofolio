import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MessageCircle, Calendar, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${formData.name || "visitor"}`);
    const body = encodeURIComponent(`${formData.message}\n\nReply to: ${formData.email}`);
    window.location.href = `mailto:mohamedstark874@gmail.com?subject=${subject}&body=${body}`;
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#00d4aa]">Build With Me</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            Looking for AI engineering, backend systems, or a serious product prototype? Send the
            problem, constraints, and timeline. I respond with next steps, not vague enthusiasm.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {[
              {
                icon: Mail,
                label: "Email",
                value: "mohamedstark874@gmail.com",
                href: "mailto:mohamedstark874@gmail.com",
              },
              {
                icon: Github,
                label: "GitHub",
                value: "github.com/mido685",
                href: "https://github.com/mido685",
              },
              {
                icon: Linkedin,
                label: "LinkedIn",
                value: "mohamed-ibrahim-967831187",
                href: "https://www.linkedin.com/in/mohamed-ibrahim-967831187",
              },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "Chat on WhatsApp",
                href: "https://wa.me/201121079983",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-start gap-4 bg-[#111827] border border-[#00d4aa]/15 rounded-lg p-4 hover:border-[#00d4aa]/40 transition-colors"
              >
                <item.icon className="w-5 h-5 text-[#00d4aa] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  <p className="text-[#00d4aa] text-sm break-all">{item.value}</p>
                </div>
              </a>
            ))}

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {[
                { icon: Clock, label: "Response", value: "24-48h" },
                { icon: MapPin, label: "Location", value: "Cairo" },
                { icon: Calendar, label: "Status", value: "Open" },
              ].map((item) => (
                <div key={item.label} className="bg-[#111827] border border-[#00d4aa]/15 rounded-lg p-4">
                  <item.icon className="w-4 h-4 text-[#00d4aa] mb-2" />
                  <p className="text-gray-500 text-xs">{item.label}</p>
                  <p className="text-white text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#111827] border border-[#00d4aa]/20 rounded-lg p-6 card-glow"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#00d4aa]/20 rounded-lg text-gray-300 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00d4aa]/50 transition-all"
              />
              <input
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#00d4aa]/20 rounded-lg text-gray-300 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00d4aa]/50 transition-all"
              />
              <textarea
                placeholder="Tell me what you want to build, what exists today, and what success looks like."
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#00d4aa]/20 rounded-lg text-gray-300 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00d4aa]/50 transition-all resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#00d4aa] text-[#0a0e1a] font-semibold rounded-lg hover:bg-[#00e5bb] transition-all duration-200 active:scale-[0.97]"
              >
                Draft Email
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
