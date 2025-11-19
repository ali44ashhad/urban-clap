import React, { useState } from "react";
import api from "../api/client"; // your existing axios client
import { MailIcon, PhoneIcon, LocationMarkerIcon } from "@heroicons/react/outline";
 

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.message.trim()) e.message = "Tell us what you need";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    try {
      setSubmitting(true);
      // POST to your contact endpoint - change path if different
      await api.post("/contact", { ...form });
      setSuccess("Thank you! We received your message. We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Contact form submit error", err);
      setServerError(
        err?.response?.data?.message || "Something went wrong. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left: Contact form */}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Get in touch</h2>
            <p className="text-gray-600 mb-6">Questions, booking help or custom requests — send us a message and we'll respond quickly.</p>

            {success && (
              <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 border border-green-100">{success}</div>
            )}

            {serverError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 border border-red-100">{serverError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="+91 98765 43210"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Describe your request, preferred date/time, or any other details"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && <p id="message-error" className="mt-1 text-xs text-red-600">{errors.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow hover:opacity-95 disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>

                <div className="text-xs text-gray-500">We reply within 24 hours</div>
              </div>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              Or reach out directly at <a href="mailto:support@urbanclub.com" className="text-blue-600 underline">support@urbanclub.com</a> or call <a href="tel:+919876543210" className="text-blue-600 underline">+91 98765 43210</a>.
            </div>
          </div>

          {/* Right: Contact details + map */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800">Contact information</h3>
              <p className="text-gray-600 mt-2">We're available across 50+ cities. Reach out and we'll route your request to the nearest team.</p>

              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600">
                    <PhoneIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Phone</div>
                    <div className="text-sm text-gray-600">+91 98765 43210</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 text-green-600">
                    <MailIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Email</div>
                    <div className="text-sm text-gray-600">support@urbanclub.com</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-purple-50 text-purple-600">
                    <LocationMarkerIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Head Office</div>
                    <div className="text-sm text-gray-600">Mumbai, Maharashtra — India</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
              {/* Simple responsive Google Maps iframe - replace src with your real location */}
              <iframe
                title="Urban Club locations"
                className="w-full h-56 border-0"
                loading="lazy"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.123456789!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6b0f0c0c0c1%3A0x123456789abcdef!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1600000000000"
              />
            </div>

            <div className="bg-white rounded-2xl shadow p-4 text-sm text-gray-600">
              <strong>Business hours</strong>
              <div className="mt-2">Mon - Sat: 8:00 AM — 8:00 PM</div>
              <div>Sun: 9:00 AM — 6:00 PM</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
