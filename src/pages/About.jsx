import React from "react";
import { Link } from "react-router-dom";

 

export default function About() {
  const team = [
    { name: "Amit Sharma", role: "Co-founder & CEO", bio: "Ex-operations lead with 10+ years scaling field services.", img: "/images/team/amit.jpg" },
    { name: "Priya Kumar", role: "Head of Product", bio: "Design-led product manager focused on delightful experiences.", img: "/images/team/priya.jpg" },
    { name: "Rahul Verma", role: "Head of Tech", bio: "Building resilient platforms and integrations.", img: "/images/team/rahul.jpg" },
  ];

  const values = [
    { title: "Trust & Safety", desc: "Certified technicians, thorough background checks and warranty on every job." },
    { title: "Transparent Pricing", desc: "No hidden fees — clear line-items and upfront estimates." },
    { title: "Customer First", desc: "Rapid support and a 90-day satisfaction warranty on most services." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <div className="bg-white rounded-3xl shadow-lg p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Urban Club</h1>
              <p className="text-gray-700 text-lg mb-4">We make home services reliable, affordable and easy. From AC repairs to installations and deep cleans, Urban Club connects you with certified technicians across 50+ cities.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-gray-500">Cities served</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-sm text-gray-500">Ratings</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold">90%</div>
                  <div className="text-sm text-gray-500">Repeat customers</div>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/services" className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold">Browse Services</Link>
                <Link to="/contact" className="ml-4 inline-block px-5 py-3 border border-gray-200 rounded-2xl">Contact Us</Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src="/images/about/hero.jpg" alt="Team working" className="w-full h-72 object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Values */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4">Our mission</h2>
            <p className="text-gray-700 mb-4">To bring trust and convenience to everyday home services. We do this by vetting technicians, standardizing pricing and building a smooth booking experience so you get high-quality work without the hassle.</p>

            <h3 className="text-lg font-medium mb-3">How we work</h3>
            <ol className="space-y-3 text-gray-600 list-decimal list-inside">
              <li>Technician verification & training</li>
              <li>Transparent pricing & fixed-time slots</li>
              <li>Digital receipts, follow-up support and warranty</li>
            </ol>
          </div>

          <aside className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Our values</h3>
            <div className="space-y-3">
              {values.map((v) => (
                <div key={v.title} className="p-3 rounded-lg bg-gray-50">
                  <div className="font-medium">{v.title}</div>
                  <div className="text-sm text-gray-600">{v.desc}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Meet the team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.name} className="flex gap-4 items-center bg-gray-50 rounded-lg p-4">
                <img src={m.img} alt={m.name} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-gray-500">{m.role}</div>
                  <div className="text-sm text-gray-600 mt-1">{m.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline / Milestones */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Our journey</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <div className="font-medium">2019 — Launched in Mumbai</div>
              <div className="text-sm">Started with AC repair services and 50+ technicians.</div>
            </div>
            <div>
              <div className="font-medium">2021 — Expanded to 20 cities</div>
              <div className="text-sm">Added installation and preventive maintenance offerings.</div>
            </div>
            <div>
              <div className="font-medium">2023 — 100k+ bookings</div>
              <div className="text-sm">Reached a milestone with improvements in SLA and quality checks.</div>
            </div>
          </div>
        </div>

        {/* FAQ + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">
            <h3 className="text-xl font-semibold mb-4">Frequently asked questions</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <div className="font-medium">How are technicians vetted?</div>
                <div className="text-sm">We conduct ID checks, certifications and trial jobs. Only trained and verified technicians are listed.</div>
              </div>

              <div>
                <div className="font-medium">What warranty do you provide?</div>
                <div className="text-sm">Most services come with a 90-day warranty — details appear on the booking confirmation.</div>
              </div>

              <div>
                <div className="font-medium">Do you accept corporate accounts?</div>
                <div className="text-sm">Yes — we offer enterprise billing and SLAs. Contact our support team via the Contact page.</div>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to book?</h3>
              <p className="text-sm text-gray-600 mb-4">Find a technician in your city and book a slot in minutes.</p>
              <Link to="/services" className="inline-flex px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl">Browse services</Link>
            </div>

            <div className="mt-6 text-sm text-gray-500">Need help? <Link to="/contact" className="text-blue-600 underline">Contact support</Link></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
