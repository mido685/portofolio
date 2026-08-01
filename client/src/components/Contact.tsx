import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (Demo only)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-[#0a0e1a]">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#00d4aa] text-center mb-16"
        >
          Get In Touch
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-[#00d4aa] mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Email</p>
                <a href="mailto:mohamedstark874@gmail.com" className="text-[#00d4aa] text-sm hover:underline">
                  mohamedstark874@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Github className="w-5 h-5 text-[#00d4aa] mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">GitHub</p>
                <a href="https://github.com/mido685" target="_blank" rel="noopener noreferrer" className="text-[#00d4aa] text-sm hover:underline">
                  https://github.com/mido685
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Linkedin className="w-5 h-5 text-[#00d4aa] mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">LinkedIn</p>
                <a href="https://www.linkedin.com/in/mohamed-ibrahim-967831187" target="_blank" rel="noopener noreferrer" className="text-[#00d4aa] text-sm hover:underline">
                  https://www.linkedin.com/in/mohamed-ibrahim-967831187
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MessageCircle className="w-5 h-5 text-[#00d4aa] mt-1 flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">WhatsApp</p>
                <a
                  href="https://wa.me/201121079983"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00d4aa] text-sm hover:underline"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#111827] border border-[#00d4aa]/20 rounded-lg text-gray-300 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00d4aa]/50 transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#111827] border border-[#00d4aa]/20 rounded-lg text-gray-300 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00d4aa]/50 transition-all"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-[#111827] border border-[#00d4aa]/20 rounded-lg text-gray-300 text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#00d4aa]/50 transition-all resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#00d4aa] text-[#0a0e1a] font-semibold rounded-lg hover:bg-[#00e5bb] transition-all duration-200 active:scale-[0.97]"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}