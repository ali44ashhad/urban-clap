// api/addresses/index.js
// Simple Vercel serverless endpoint that accepts POST to create an address and returns it.
// Keeps an in-memory store for demo; not persistent across cold starts.

let ADDRESSES = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, phone, line1, pincode, landmark } = req.body || {};
      if (!name || !phone || !line1 || !pincode) {
        return res.status(400).json({ message: "Missing required address fields: name, phone, line1, pincode" });
      }
      const addr = {
        id: "addr_" + Date.now(),
        name,
        phone,
        line1,
        pincode,
        landmark: landmark || null,
        createdAt: new Date().toISOString()
      };
      ADDRESSES.push(addr);
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(201).json(addr);
    } catch (err) {
      console.error("addresses handler error", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "GET") {
    return res.status(200).json(ADDRESSES);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
