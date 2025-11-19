// // api/bookings/index.js
// export default function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const payload = req.body || {};
//       // create a mock booking id and timestamp
//       const booking = {
//         id: `bk_${Date.now()}`,
//         serviceId: payload.serviceId || payload.service?.id || null,
//         serviceTitle: payload.service?.title || payload.title || "Unknown service",
//         name: payload.name || payload.customerName || "Guest",
//         phone: payload.phone || payload.customerPhone || null,
//         slot: payload.slot || payload.date || null,
//         status: "confirmed",
//         createdAt: new Date().toISOString(),
//       };

//       // NOTE: serverless functions are stateless — we return created booking but it won't persist across invocations.
//       res.setHeader("Cache-Control", "s-maxage=0, stale-while-revalidate=0");
//       return res.status(201).json({ success: true, booking });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }
//   }

//   // reject other methods
//   res.setHeader("Allow", "POST");
//   return res.status(405).end("Method Not Allowed");
// }

// api/bookings/index.js
let BOOKINGS = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(BOOKINGS);
  }
  if (req.method === "POST") {
    const { serviceId, name, phone, email, slot } = req.body || {};
    if (!serviceId || !name || !phone || !slot) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const b = { id: "bk_" + Date.now(), serviceId, name, phone, email: email||null, slot, status: "confirmed", createdAt: new Date().toISOString() };
    BOOKINGS.push(b);
    return res.status(201).json(b);
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
