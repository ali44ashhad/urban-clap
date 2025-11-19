// api/bookings/index.js
// Enhanced bookings endpoint: supports both simple and checkout-style payloads.
// In-memory BOOKING store for demo.

let BOOKINGS = [];

function validateSimplePayload(body) {
  const { serviceId, name, phone, slot } = body || {};
  return serviceId && name && phone && slot;
}

export default function handler(req, res) {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(BOOKINGS);
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};

      // Case A: legacy simple booking
      if (validateSimplePayload(body)) {
        const b = {
          id: "bk_" + Date.now(),
          serviceId: body.serviceId,
          customerName: body.name,
          customerPhone: body.phone,
          slot: body.slot,
          email: body.email || null,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          raw: body
        };
        BOOKINGS.push(b);
        return res.status(201).json(b);
      }

      // Case B: checkout payload (bulk / cart)
      // Expect something like: { userPhone, services, address, appointment: {date, slot}, payment, totalAmount }
      const { userPhone, services, address, appointment, payment, totalAmount, status } = body;

      if (!userPhone || !Array.isArray(services) || !address || !appointment?.slot) {
        return res.status(400).json({ message: "Missing required booking fields (userPhone, services[], address, appointment.slot)" });
      }

      const booking = {
        id: "bk_" + Date.now(),
        userPhone,
        services: services.map((s) => ({
          id: s.id || s.serviceId || null,
          title: s.title || s.name || null,
          qty: s.qty || 1,
          unitPrice: s.unitPrice || s.price || s.basePrice || 0,
          variant: s.variant || s.name || null,
          raw: s
        })),
        address,
        appointment,
        payment: payment || null,
        totalAmount: totalAmount || 0,
        status: status || "confirmed",
        createdAt: new Date().toISOString(),
        raw: body
      };

      BOOKINGS.push(booking);
      return res.status(201).json(booking);
    } catch (err) {
      console.error("bookings handler error", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
