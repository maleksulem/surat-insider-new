import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { triggerWhatsAppMessage } from "../App";
import { useDocumentMetadata } from "../hooks/useDocumentMetadata";
import { Role, PartnerRequest } from "../types";
import { ArrowRight, CheckCircle, Mail, MessageSquare, Building2, UserPlus, Globe2, Briefcase, Rocket, Phone } from "lucide-react";

interface WorkWithUsPageProps {
  currentUserRole: Role | "Guest";
  setCurrentUserRole: (role: Role | "Guest") => void;
  setPartnerRequests: React.Dispatch<React.SetStateAction<PartnerRequest[]>>;
  addAuditLog: (action: string, targetType: string, targetName: string) => void;
}

export function WorkWithUsPage({
  currentUserRole,
  setCurrentUserRole,
  setPartnerRequests,
  addAuditLog,
}: WorkWithUsPageProps) {
  useDocumentMetadata({
    title: "Work With Us • Surat Insider Collective",
    description: "Join the Surat Insider collective. A dedicated portal for business enquiries, brand partnerships, and tourism collaborations.",
  });

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    partnershipType: "Brand Partnership",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.businessName) return;

    const newRequest: PartnerRequest = {
      id: `part-${Date.now()}`,
      businessName: formData.businessName,
      businessType: "shop", // Default classification or derived
      contactEmail: formData.email,
      requestedUpdate: `[${formData.partnershipType}] ${formData.message || "New partnership inquiry."}`,
      status: "Pending Approval",
      date: new Date().toISOString().split("T")[0],
    };

    fetch("/api/partner-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRequest)
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.request) {
        setPartnerRequests((prev) => [data.request, ...prev]);
      }
    })
    .catch((err) => {
      console.error("Partner submission error:", err);
      setPartnerRequests((prev) => [newRequest, ...prev]);
    });

    const waText = `🤝 *NEW PARTNER APPLICATION* 🤝\n\n` +
      `🏢 *Business:* ${formData.businessName}\n` +
      `👤 *Contact:* ${formData.name}\n` +
      `🏷️ *Type:* ${formData.partnershipType.toUpperCase()}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `📱 *Phone:* ${formData.phone || "Not provided"}\n\n` +
      `📝 *Notes:* \n"${formData.message}"\n\n` +
      `📅 *Date:* ${newRequest.date}\n` +
      `🔗 SENT VIA WORK WITH US HUB.`;

    triggerWhatsAppMessage(waText);

    setFormData({ name: "", email: "", phone: "", businessName: "", partnershipType: "Brand Partnership", message: "" });
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000);
    addAuditLog("Collaboration Inquiry Submitted", "Partner Request", formData.businessName);
  };

  const benefits = [
    {
      title: "Global Visibility",
      desc: "Connect with high-net-worth travelers and discerning local explorers seeking premium experiences.",
      icon: Globe2
    },
    {
      title: "Editorial Storytelling",
      desc: "We don't just list businesses; we craft narratives that celebrate your craftsmanship and legacy.",
      icon: MessageSquare
    },
    {
      title: "Strategic Growth",
      desc: "Gain access to cross-industry collaborations between hotels, retail, and culinary directors.",
      icon: Rocket
    }
  ];

  const partnershipTypes = [
    "Business Enquiry",
    "Brand Partnerships",
    "Tourism Partnerships",
    "Hotel Partnerships",
    "Restaurant Partnerships",
    "Retail Partnerships",
    "Content Creator Partnerships"
  ];

  return (
    <div className="min-h-screen bg-brand-sand-50 flex flex-col font-sans">
      <Navbar
        currentTab=""
        setCurrentTab={() => {}}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
      />

      <main className="flex-1">
        {/* Editorial Hero */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.4em] text-brand-gold-500 font-bold block">Collaboration</span>
            <h1 className="font-serif text-5xl md:text-8xl font-black text-[#1A1614] tracking-tight leading-[0.9]">
              Join the <br />
              <span className="text-brand-gold-500 italic font-normal">Collective.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#1A1614]/40 font-light leading-relaxed">
              We curate the definitive guide to Surat's excellence. If your brand embodies quality, heritage, or innovation, we invite you to become part of our narrative.
            </p>
          </motion.div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 bg-white/50 backdrop-blur-sm border-y border-[#1A1614]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-6 text-center md:text-left"
              >
                <div className="w-16 h-16 rounded-3xl bg-brand-gold-500/10 flex items-center justify-center mx-auto md:mx-0">
                  <benefit.icon className="w-8 h-8 text-brand-gold-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1A1614]">{benefit.title}</h3>
                <p className="text-sm text-[#1A1614]/50 leading-relaxed font-light">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Partnership Form */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-white border border-[#1A1614]/5 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-brand-sand-300/50 space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1614]">Start the Conversation</h2>
              <p className="text-sm text-[#1A1614]/40 font-light">Tell us about your brand and how you'd like to collaborate.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {formSent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-brand-emerald-50 border border-brand-emerald-200 text-brand-emerald-900 rounded-2xl font-medium flex items-center gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-brand-emerald-600 shrink-0" />
                  <p>Thank you. Your collaboration inquiry has been received by our editorial board.</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-sand-50 border border-[#1A1614]/5 rounded-2xl p-5 focus:outline-none focus:border-brand-gold-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-brand-sand-50 border border-[#1A1614]/5 rounded-2xl p-5 focus:outline-none focus:border-brand-gold-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-brand-sand-50 border border-[#1A1614]/5 rounded-2xl p-5 focus:outline-none focus:border-brand-gold-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Business/Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-brand-sand-50 border border-[#1A1614]/5 rounded-2xl p-5 focus:outline-none focus:border-brand-gold-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Partnership Type</label>
                  <select
                    value={formData.partnershipType}
                    onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                    className="w-full bg-brand-sand-50 border border-[#1A1614]/5 rounded-2xl p-5 focus:outline-none focus:border-brand-gold-500 transition-all appearance-none cursor-pointer"
                  >
                    {partnershipTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A1614]/60 ml-2">Collaboration Notes</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more about your brand and vision..."
                  rows={4}
                  className="w-full bg-brand-sand-50 border border-[#1A1614]/5 rounded-2xl p-5 focus:outline-none focus:border-brand-gold-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1614] hover:bg-brand-gold-600 text-white text-xs font-bold uppercase tracking-[0.4em] py-6 rounded-2xl transition-all duration-500 flex items-center justify-center gap-4 shadow-xl"
              >
                Submit Inquiry
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#1A1614] text-brand-sand-50/20 shrink-0 text-center py-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.5em] font-bold">
          Surat Insider • Collective Management
        </p>
      </footer>
    </div>
  );
}
