// api/slots/index.js
// Simple serverless endpoint for Vercel that always returns slots array (200).
// Put this at repository root: api/slots/index.js

const MOCK_SLOTS = {
  "2025-11-27": [
    { slot: "09:00 AM", booked: 2, capacity: 5 },
    { slot: "11:00 AM", booked: 5, capacity: 5 },
    { slot: "01:00 PM", booked: 1, capacity: 5 },
    { slot: "03:00 PM", booked: 4, capacity: 5 },
    { slot: "05:00 PM", booked: 0, capacity: 5 },
  ],
  // add more dates if you want
};

export default function handler(req, res) {
  try {
    const date = req.query.date || Object.keys(MOCK_SLOTS)[0];
    const slots = MOCK_SLOTS[date] || [];

    // Always return 200 + body. Disable caching here to avoid 304 behavior.
    res.setHeader("Cache-Control", "s-maxage=0, stale-while-revalidate=0, max-age=0, no-store");
    return res.status(200).json({ slots });
  } catch (err) {
    console.error("slots handler error", err);
    return res.status(500).json({ message: "Internal error" });
  }
}
