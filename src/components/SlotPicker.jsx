// import React, { useEffect, useState } from "react";
// import api from "../api/client";

// export default function SlotPicker({ date, value, onChange }) {
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!date) return;
    
//     const fetchSlots = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await api.get(`/slots?date=${date}`);
//         setSlots(res.data.slots);
//       } catch (err) {
//         setError("Failed to load slots. Please try again.");
//         console.error("Error fetching slots:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSlots();
//   }, [date]);

//   const getSlotStatus = (slot) => {
//     if (slot.booked >= slot.capacity) return "full";
//     if (slot.booked >= slot.capacity * 0.8) return "limited";
//     return "available";
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "full": return "bg-red-100 border-red-300 text-red-700";
//       case "limited": return "bg-orange-100 border-orange-300 text-orange-700";
//       default: return "bg-green-100 border-green-300 text-green-700";
//     }
//   };

//   const getStatusText = (slot) => {
//     const status = getSlotStatus(slot);
//     const available = slot.capacity - slot.booked;
    
//     switch (status) {
//       case "full": return "Fully Booked";
//       case "limited": return `${available} Left - Hurry!`;
//       default: return `${available} Available`;
//     }
//   };

//   const formatTime = (timeString) => {
//     const [time, period] = timeString.split(' ');
//     return `${time} ${period}`;
//   };

//   if (!date) {
//     return (
//       <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
//         <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//         </svg>
//         <p className="text-gray-600 font-medium">Select a date to view available slots</p>
//         <p className="text-gray-400 text-sm mt-1">Choose your preferred date first</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
//             <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             Loading Available Slots...
//           </h3>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {[...Array(6)].map((_, index) => (
//             <div key={index} className="p-4 rounded-xl border border-gray-200 animate-pulse">
//               <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-6 bg-red-50 rounded-xl border border-red-200">
//         <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         <p className="text-red-700 font-medium">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium underline"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
//           <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           Available Time Slots
//         </h3>
//         <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
//           {new Date(date).toLocaleDateString('en-IN', { 
//             weekday: 'short', 
//             day: 'numeric', 
//             month: 'short' 
//           })}
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="flex flex-wrap gap-4 text-xs">
//         <div className="flex items-center gap-1">
//           <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
//           <span className="text-gray-600">Available</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
//           <span className="text-gray-600">Limited</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
//           <span className="text-gray-600">Full</span>
//         </div>
//       </div>

//       {/* Slots Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//         {slots.map((slot) => {
          
//           const status = getSlotStatus(slot);
//           const isSelected = value === slot.slot;
//           const isDisabled = status === "full";

//           return (
//             <button
//               key={slot.slot}
//               disabled={isDisabled}
//               onClick={() => onChange(slot.slot)}
//               className={`
//                 p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden
//                 ${isSelected 
//                   ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]" 
//                   : isDisabled
//                     ? "cursor-not-allowed opacity-60"
//                     : "hover:border-gray-400 hover:shadow-sm hover:scale-[1.01]"
//                 }
//                 ${getStatusColor(status)}
//               `}
//             >
//               {/* Selected Indicator */}
//               {isSelected && (
//                 <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
//               )}

//               {/* Time */}
//               <div className={`font-semibold text-lg mb-1 ${isSelected ? "text-blue-700" : ""}`}>
//                 {formatTime(slot.slot)}
//               </div>

//               {/* Status */}
//               <div className={`text-sm font-medium ${isSelected ? "text-blue-600" : ""}`}>
//                 {getStatusText(slot)}
//               </div>

//               {/* Capacity Bar */}
//               {!isDisabled && (
//                 <div className="mt-2">
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div 
//                       className={`h-1.5 rounded-full transition-all duration-500 ${
//                         status === "limited" ? "bg-orange-400" : "bg-green-400"
//                       }`}
//                       style={{ 
//                         width: `${(slot.booked / slot.capacity) * 100}%` 
//                       }}
//                     ></div>
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     {slot.booked} of {slot.capacity} booked
//                   </div>
//                 </div>
//               )}

//               {/* Full Badge */}
//               {isDisabled && (
//                 <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
//                   <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
//                     FULLY BOOKED
//                   </span>
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* Empty State */}
//       {slots.length === 0 && !loading && (
//         <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
//           <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-gray-600 font-medium">No slots available</p>
//           <p className="text-gray-400 text-sm mt-1">Please try another date</p>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState, useRef } from "react";
import api from "../api/client";

export default function SlotPicker({ date, value, onChange }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep a cache of last successful slots so we can handle 304 / empty body gracefully
  const cachedSlotsRef = useRef([]);

  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        // Note: you can pass headers to force fresh result if you prefer:
        // const res = await api.get(`/slots?date=${date}`, { headers: { 'Cache-Control': 'no-cache' }});
        const res = await api.get(`/slots?date=${date}`, {
          validateStatus: (s) => s === 200 || s === 304 || (s >= 200 && s < 300),
        });

        // Debug: log status and payload to console (remove in production)
        console.log("[SlotPicker] slots response status:", res.status, "data:", res.data);

        // If server returns an object with slots key, use it; else if it returns array directly, use that.
        let payloadSlots = [];
        if (res.status === 304) {
          // Not Modified — use cached if available
          payloadSlots = cachedSlotsRef.current || [];
        } else {
          // Prefer res.data.slots, fallback to res.data if that's an array
          if (res.data) {
            if (Array.isArray(res.data.slots)) payloadSlots = res.data.slots;
            else if (Array.isArray(res.data)) payloadSlots = res.data;
            else if (res.data?.slots && Array.isArray(res.data.slots)) payloadSlots = res.data.slots;
            else payloadSlots = []; // unexpected shape -> empty
          } else {
            payloadSlots = [];
          }
        }

        // Save a copy to cache when we got a non-empty result
        if (Array.isArray(payloadSlots) && payloadSlots.length > 0) {
          cachedSlotsRef.current = payloadSlots;
        }

        setSlots(payloadSlots);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError("Failed to load slots. Please try again.");
        // keep previous cached slots if available so UI can still show something
        if (cachedSlotsRef.current && cachedSlotsRef.current.length > 0) {
          setSlots(cachedSlotsRef.current);
        } else {
          setSlots([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  const getSlotStatus = (slot) => {
    // Defensive: ensure slot has booked/capacity numbers
    const booked = Number(slot?.booked || 0);
    const capacity = Number(slot?.capacity || 1);
    if (capacity <= 0) return "full";
    if (booked >= capacity) return "full";
    if (booked >= capacity * 0.8) return "limited";
    return "available";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "full": return "bg-red-100 border-red-300 text-red-700";
      case "limited": return "bg-orange-100 border-orange-300 text-orange-700";
      default: return "bg-green-100 border-green-300 text-green-700";
    }
  };

  const getStatusText = (slot) => {
    const status = getSlotStatus(slot);
    const available = Math.max(0, (Number(slot?.capacity || 0) - Number(slot?.booked || 0)));
    switch (status) {
      case "full": return "Fully Booked";
      case "limited": return `${available} Left - Hurry!`;
      default: return `${available} Available`;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    // if slot string already like "10:00 AM" just return it
    return timeString;
  };

  if (!date) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-600 font-medium">Select a date to view available slots</p>
        <p className="text-gray-400 text-sm mt-1">Choose your preferred date first</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Loading Available Slots...
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 rounded-xl border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 bg-red-50 rounded-xl border border-red-200">
        <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-700 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Available Time Slots
        </h3>
        <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {new Date(date).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
          <span className="text-gray-600">Limited</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-gray-600">Full</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {(Array.isArray(slots) ? slots : []).map((slot) => {
          const status = getSlotStatus(slot);
          const isSelected = value === slot.slot;
          const isDisabled = status === "full";

          return (
            <button
              key={slot.slot ?? JSON.stringify(slot)}
              disabled={isDisabled}
              onClick={() => onChange(slot.slot)}
              className={`
                p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden
                ${isSelected 
                  ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]" 
                  : isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "hover:border-gray-400 hover:shadow-sm hover:scale-[1.01]"
                }
                ${getStatusColor(status)}
              `}
            >
              {isSelected && <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>}
              <div className={`font-semibold text-lg mb-1 ${isSelected ? "text-blue-700" : ""}`}>
                {formatTime(slot.slot)}
              </div>
              <div className={`text-sm font-medium ${isSelected ? "text-blue-600" : ""}`}>
                {getStatusText(slot)}
              </div>

              {!isDisabled && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${status === "limited" ? "bg-orange-400" : "bg-green-400"}`}
                      style={{ width: `${(Number(slot.booked || 0) / Math.max(1, Number(slot.capacity || 1))) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Number(slot.booked || 0)} of {Number(slot.capacity || 0)} booked
                  </div>
                </div>
              )}

              {isDisabled && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">FULLY BOOKED</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {(!slots || slots.length === 0) && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium">No slots available</p>
          <p className="text-gray-400 text-sm mt-1">Please try another date</p>
        </div>
      )}
    </div>
  );
}
