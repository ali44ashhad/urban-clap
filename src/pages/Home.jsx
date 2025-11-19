import React, { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import ServiceCard from "../components/ServiceCard";
import ServiceModal from "../components/ServiceModal";
import HowItWorks from "../components/HowItWorks";
import ServiceAreas from "../components/ServiceAreas";
import Testimonials from "../components/Testimonials";
import FeaturedServices from "../components/FeaturedServices";
import HeroModern from "../components/HeroModern";
// If you want to navigate to a separate checkout route instead of a modal:
// import { useNavigate } from "react-router-dom";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const [selectedService, setSelectedService] = useState(null);

  // New state to explicitly track booking flow (optional but clearer)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // const navigate = useNavigate(); // if you want to navigate to /checkout

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/services");
        console.log("GET /api/services response:", response.data);

        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          console.warn("Unexpected /api/services payload, expected array:", response.data);
          setServices([]);
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
        setServices([]);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // stable callback to avoid re-creating function on every render (prevents child re-renders)
  const handleSelectService = useCallback((service) => {
    // toggle selection on repeated clicks
    setSelectedService(prev => (prev?.id === service.id ? null : service));
  }, []);

  // --- New: open booking flow immediately (called from ServiceCard onBook) ---
  const openBookingModal = useCallback((service) => {
    // Ensure the service is selected
    setSelectedService(service);

    // Open the booking modal (this could also navigate to a checkout route)
    setIsBookingModalOpen(true);

    // If you prefer route-based checkout instead of modal:
    // navigate("/checkout", { state: { service } });
  }, []);

  const closeBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
    // optionally keep selectedService or clear it:
    // setSelectedService(null);
  }, []);

  // Confirm booking (called from modal when user confirms)
  // implement API call / payment / navigation here
  const handleConfirmBooking = useCallback(async (bookingDetails) => {
    try {
      // example: call booking API
      // await api.post("/bookings", { serviceId: selectedService.id, ...bookingDetails });

      // For now just close the modal and maybe show a toast
      setIsBookingModalOpen(false);
      // optionally clear selection:
      // setSelectedService(null);
      alert("Booking confirmed (wire this to your booking API).");
    } catch (err) {
      console.error("Booking failed", err);
      alert("Failed to book. Please try again.");
    }
  }, [selectedService]);

  // Extract unique categories
  const categories = React.useMemo(() => {
    const allCategories = services
      .map(service => service.category)
      .filter(Boolean)
      .filter((category, index, self) => self.indexOf(category) === index);

    return ["all", ...allCategories];
  }, [services]);

  // Filter and sort services (same logic you had)
  const filteredServices = React.useMemo(() => {
    let filtered = services.filter(service => {
      const matchesSearch = service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [services, searchTerm, selectedCategory, sortBy]);

  if (error && services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Services</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     <HeroModern
  onSearch={(term) => {
    // update homepage search and scroll to services
    setSearchTerm(term || "");
    // optional: scroll to services list
    document.querySelector('#services-scroll')?.scrollIntoView({ behavior: 'smooth' });
  }}
  onBook={(service) => {
    // reuse your existing booking flow
    openBookingModal(service);
    // ensure services list area is visible if needed
    document.querySelector('#services-scroll')?.scrollIntoView({ behavior: 'smooth' });
  }}
/>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Filters and Sorting */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all duration-200 capitalize
                  ${selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }
                `}
              >
                {category === "all" ? "All Services" : category}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-gray-600 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory === "all" ? "All Services" : selectedCategory}
            </h2>
            <p className="text-gray-600 mt-1">
              Showing {filteredServices.length} of {services.length} services
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredServices.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={handleSelectService}
                // NEW: pass onBook so clicking "Book Now" immediately starts booking
                onBook={openBookingModal}
                isSelected={selectedService?.id === service.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Services Found</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              {searchTerm
                ? `No services found matching "${searchTerm}". Try adjusting your search or filters.`
                : "No services available in this category at the moment."
              }
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      <FeaturedServices services={services} />
      <HowItWorks />
      <ServiceAreas />
      <Testimonials />

      {/* Modal: show details and booking actions.
          - I pass isBooking and onConfirmBooking so ServiceModal can display booking UI.
          - If your ServiceModal doesn't accept those props, add support or create a separate BookingModal.
      */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => {
            setSelectedService(null);
            setIsBookingModalOpen(false);
          }}
          // Optional: let the modal know it's currently in booking flow
          isBooking={isBookingModalOpen}
          // Called when user confirms booking inside the modal
          onConfirmBooking={handleConfirmBooking}
        />
      )}
    </div>
  );
}
