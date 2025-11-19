import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// Adjust the import path below to wherever you keep your services export
import { services } from '../mocks/seed'

export default function HeroModern({ onSearch, onBook }) {
  const [searchTerm, setSearchTerm] = useState('')
  const popular = ['AC Repair', 'Split AC Cleaning', 'Gas Refilling', 'Installation']

  // carousel state for right-side services card
  const [current, setCurrent] = useState(0)
  const total = services.length

  // autoplay every 3.5s
  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 3500)
    return () => clearInterval(id)
  }, [total])

  const handlePrev = () => setCurrent((c) => (c - 1 + total) % total)
  const handleNext = () => setCurrent((c) => (c + 1) % total)

  const handleSearch = () => {
    // call parent handler if provided
    if (onSearch) onSearch(searchTerm)
  }

  // helper: compute starting price across variants
  const getStartsAt = (svc) => {
    if (!svc.variants || svc.variants.length === 0) return svc.basePrice
    const prices = svc.variants.map((v) => svc.basePrice + (v.priceModifier || 0))
    return Math.min(...prices)
  }

  const handleBookCurrent = () => {
    const svc = services[current]
    // call parent's onBook with the current service if provided
    if (onBook) onBook(svc)
    else {
      // fallback: open a new tab / console (or show a toast). Keeping fallback mild.
      console.log('Book requested for', svc)
      alert(`${svc.title} requested to book — pass onBook prop from parent to proceed.`)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061223] via-[#0b2540] to-[#2b1055] text-white px-6 py-20">
      <div className="pointer-events-none absolute -right-32 top-8 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#7c3aed]/30 to-[#06b6d4]/20 blur-3xl mix-blend-screen" />
      <div className="pointer-events-none absolute left-0 bottom-0 w-[480px] h-[360px] rounded-tl-[50%] bg-white/3 blur-2xl" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-3 bg-white/6 px-3 py-1 rounded-full mb-6 border border-white/8 backdrop-blur-sm">
              <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="text-sm">Certified Pros • 90-day warranty • Contactless</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.02] mb-4">
              Reliable <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffffff] via-[#d1d5db] to-[#a78bfa]">AC care</span> — fast, on-demand
            </h1>

            <p className="text-lg text-white/80 mb-6 max-w-2xl">
              Book verified technicians for repair, installation, deep cleaning and gas top-ups. Transparent pricing, flexible slots and rated across 50+ cities.
            </p>

            <div className="flex flex-wrap gap-3 items-center mb-6">
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => {
                // Book Service in hero: if parent passed onBook, prefer opening booking for highlighted service.
                // otherwise fallback to search action.
                if (onBook) handleBookCurrent()
                else handleSearch()
              }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#0b2540] font-semibold rounded-2xl shadow-xl">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Book Service
              </motion.button>

              <button onClick={() => document.querySelector('#services-scroll')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/6 border border-white/10 text-white rounded-2xl">
                Explore Categories
              </button>

              <div className="ml-3 text-sm text-white/80 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded-full bg-white/6">4.9 ★</div>
                  <div className="text-white/70">10,000+ ratings</div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-white/60">50+ cities</div>
              </div>
            </div>

            <div className="bg-white/6 backdrop-blur-sm border border-white/8 rounded-3xl p-4 max-w-xl shadow-2xl">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>

                <input
                  id="hero-search-input"
                  type="text"
                  placeholder="Search services — e.g. 'split AC cleaning'"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/60 text-lg focus:outline-none"
                />

                <button onClick={handleSearch} className="px-4 py-2 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-lg font-medium">
                  Search
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {popular.map((tag) => (
                  <button key={tag} onClick={() => {
                    setSearchTerm(tag);
                    if (onSearch) onSearch(tag);
                  }} className="text-sm px-3 py-1 bg-white/8 rounded-full text-white/90 hover:bg-white/12 transition">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <div className="bg-white/8 px-3 py-1 rounded-full">Certified Technicians</div>
              <div className="bg-white/8 px-3 py-1 rounded-full">Transparent Pricing</div>
              <div className="bg-white/8 px-3 py-1 rounded-full">90-day warranty</div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: service carousel card */}
        <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
          <motion.div initial={{ scale: 0.98, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md">

            <div className="bg-gradient-to-br from-white/5 to-white/3 rounded-3xl p-6 shadow-2xl border border-white/6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#7c3aed] flex items-center justify-center text-white text-2xl font-extrabold">
                  AC
                </div>

                {/* carousel content */}
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div key={services[current].id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.4 }}>

                      <div className="text-white font-bold text-lg">{services[current].title}</div>
                      <div className="text-white/80 text-sm">Starts at <span className="font-semibold">₹{getStartsAt(services[current])}</span></div>
                      <div className="mt-2 text-xs text-white/70">{services[current].description}</div>

                      <div className="mt-3 flex gap-2 flex-wrap">
                        {services[current].variants?.map((v) => (
                          <div key={v.name} className="px-2 py-1 bg-white/6 rounded-full text-xs">{v.name}</div>
                        ))}
                      </div>

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-4 bg-white rounded-xl p-3 text-gray-900">
                <div className="flex justify-between items-center">
                  <div className="text-sm">Technician ETA</div>
                  <div className="text-sm font-semibold">Today • 1:00 PM</div>
                </div>
                <div className="mt-3 text-xs text-gray-600">Certified & verified — warranty included.</div>
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={handleBookCurrent} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] text-white rounded-2xl font-semibold">Book Now</button>
                <button className="px-4 py-2 bg-white/6 text-white rounded-2xl">Details</button>
              </div>
 
            </div>

            <div className="absolute -top-6 -right-10 bg-white rounded-full p-3 shadow-xl">
              <svg className="w-8 h-8 text-[#06b6d4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>

          </motion.div>
        </div>
      </div>

      <svg className="absolute left-0 right-0 bottom-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,32 C220,120 440,0 720,32 C1000,64 1220,0 1440,32 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.02)" /></svg>
    </section>
  )
}
