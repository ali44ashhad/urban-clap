// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import api from "../api/client";
// import SlotPicker from "../components/SlotPicker";
// import PaymentStub from "../components/PaymentStub";

// export default function CheckoutPage() {
//   const { state, dispatch } = useCart();
//   const navigate = useNavigate();

//   const subtotal = state.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

//   const [address, setAddress] = useState({ name: "", phone: "", line1: "", pincode: "" });
//   const [date, setDate] = useState("");
//   const [slot, setSlot] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState(null);

//   const validate = () => {
//     if (!address.phone || !address.line1 || !address.pincode) {
//       setError("Please enter full address and phone.");
//       return false;
//     }
//     if (!date || !slot) {
//       setError("Select appointment date and slot.");
//       return false;
//     }
//     setError(null);
//     return true;
//   };

//   const onPaymentSuccess = async (paymentResult) => {
//     if (!validate()) return;
//     setProcessing(true);
//     try {
//       // create address first (mock)
//       const addrRes = await api.post("/addresses", address).then((r) => r.data);
//       const payload = {
//         userPhone: address.phone,
//         services: state.items,
//         address: addrRes,
//         appointment: { date, slot },
//         payment: { ...paymentResult },
//       };
//       const booking = await api.post("/bookings", payload).then((r) => r.data);
//       dispatch({ type: "CLEAR" });
//       navigate(`/booking/${booking.id}`);
//     } catch (e) {
//       setError(e?.response?.data?.message || "Failed to create booking. Try different slot or retry.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Checkout</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <section>
//           <h2 className="font-semibold mb-2">Address</h2>
//           <input
//             className="w-full border p-2 my-2"
//             placeholder="Name"
//             value={address.name}
//             onChange={(e) => setAddress({ ...address, name: e.target.value })}
//           />
//           <input
//             className="w-full border p-2 my-2"
//             placeholder="Phone"
//             value={address.phone}
//             onChange={(e) => setAddress({ ...address, phone: e.target.value })}
//           />
//           <input
//             className="w-full border p-2 my-2"
//             placeholder="Address line"
//             value={address.line1}
//             onChange={(e) => setAddress({ ...address, line1: e.target.value })}
//           />
//           <input
//             className="w-full border p-2 my-2"
//             placeholder="Pincode"
//             value={address.pincode}
//             onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
//           />

//           <h2 className="font-semibold mt-4 mb-2">Appointment</h2>
//           <input
//             type="date"
//             className="border p-2 w-full"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             min={new Date().toISOString().slice(0, 10)}
//           />
//           <div className="mt-3">
//             <SlotPicker date={date} value={slot} onChange={setSlot} />
//           </div>
//         </section>

//         <aside>
//           <h2 className="font-semibold mb-2">Order Summary</h2>
//           <div className="border p-4 rounded space-y-2">
//             {state.items.map((it) => (
//               <div key={`${it.id}-${it.variant}`} className="flex justify-between">
//                 <div>{it.title} x{it.qty}</div>
//                 <div>₹{it.qty * it.unitPrice}</div>
//               </div>
//             ))}

//             <div className="font-bold mt-3">Subtotal: ₹{subtotal}</div>
//             <div className="text-sm text-gray-600">Taxes included (mock)</div>

//             <div className="mt-4">
//               <PaymentStub amount={subtotal} onSuccess={onPaymentSuccess} />
//             </div>

//             {error && <div className="mt-3 text-red-600">{error}</div>}
//             {processing && <div className="mt-3 text-blue-600">Processing booking...</div>}
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/client";
import SlotPicker from "../components/SlotPicker";
import PaymentStub from "../components/PaymentStub";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const subtotal = state.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;
  const totalItems = state.items.reduce((total, item) => total + item.qty, 0);

  const [address, setAddress] = useState({ 
    name: "", 
    phone: "", 
    line1: "", 
    pincode: "",
    landmark: ""
  });
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Schedule, 3: Payment

  const validateAddress = () => {
    if (!address.name.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!address.phone.trim() || address.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!address.line1.trim()) {
      setError("Please enter your complete address");
      return false;
    }
    if (!address.pincode.trim() || address.pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return false;
    }
    setError(null);
    return true;
  };

  const validateAppointment = () => {
    if (!date) {
      setError("Please select an appointment date");
      return false;
    }
    if (!slot) {
      setError("Please select a time slot");
      return false;
    }
    setError(null);
    return true;
  };

  const onPaymentSuccess = async (paymentResult) => {
    if (!validateAddress() || !validateAppointment()) return;
    
    setProcessing(true);
    try {
      // Create address first (mock)
      const addrRes = await api.post("/addresses", address).then((r) => r.data);
      const payload = {
        userPhone: address.phone,
        services: state.items,
        address: addrRes,
        appointment: { date, slot },
        payment: { ...paymentResult },
        totalAmount: total,
        status: "confirmed"
      };
      const booking = await api.post("/bookings", payload).then((r) => r.data);
      dispatch({ type: "CLEAR" });
      navigate(`/booking/${booking.id}`);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to create booking. Please try a different slot or try again.");
    } finally {
      setProcessing(false);
    }
  };

  const nextStep = () => {
    if (activeStep === 1 && validateAddress()) {
      setActiveStep(2);
      setError(null);
    } else if (activeStep === 2 && validateAppointment()) {
      setActiveStep(3);
      setError(null);
    }
  };

  const prevStep = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some services to proceed with checkout</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your booking in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { number: 1, label: "Address", active: activeStep >= 1 },
              { number: 2, label: "Schedule", active: activeStep >= 2 },
              { number: 3, label: "Payment", active: activeStep >= 3 }
            ].map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    ${step.active 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-300 text-gray-600'
                    }
                  `}>
                    {step.active ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${step.active ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 ${step.active ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {activeStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10-digit mobile number"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      maxLength={10}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="House/Flat number, Street, Area"
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6-digit pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      maxLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nearby landmark"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Continue to Schedule
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {activeStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Schedule Appointment</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Date *
                    </label>
                    <input
                      type="date"
                      className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setSlot(""); // Reset slot when date changes
                      }}
                      min={new Date().toISOString().slice(0, 10)}
                    />
                  </div>

                  <div>
                    <SlotPicker date={date} value={slot} onChange={setSlot} />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Address
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Continue to Payment
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {activeStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Payment</h2>
                </div>

                <div className="space-y-6">
                  {/* Appointment Summary */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Appointment Scheduled</h3>
                    <div className="flex items-center gap-4 text-sm text-blue-700">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(date).toLocaleDateString('en-IN', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {slot}
                      </div>
                    </div>
                  </div>

                  {/* Payment Component */}
                  <PaymentStub amount={total} onSuccess={onPaymentSuccess} />

                  {processing && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 text-blue-700">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium">Processing your booking...</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-start mt-6">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Schedule
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                <p className="text-sm text-gray-600 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Services List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {state.items.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm line-clamp-2">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {item.variant} × {item.qty}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-800 ml-2 whitespace-nowrap">
                        ₹{item.qty * item.unitPrice}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-gray-800">Total</span>
                      <span className="text-2xl text-green-600">₹{total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}