// api/appointments/index.js
export default function handler(req, res) {
  if (req.method === "GET") {
    // return a static list for demo
    const appointments = [
      { id: "a1", bookingId: "bk_1600000000000", serviceTitle: "AC Service", slot: "2025-11-20T15:00:00Z", status: "confirmed" },
      { id: "a2", bookingId: "bk_1600000100000", serviceTitle: "Gas Refill", slot: "2025-11-22T11:00:00Z", status: "pending" }
    ];
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(appointments);
  }

  res.setHeader("Allow", "GET");
  return res.status(405).end("Method Not Allowed");
}
