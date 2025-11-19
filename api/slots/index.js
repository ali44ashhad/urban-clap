// api/slots/index.js
// Vercel serverless function: dynamically generate time slots for any requested date.
// Returns: { slots: [ { slot: "09:00 AM", booked: 2, capacity: 5 }, ... ] }

function seededRandom(seed) {
  // simple xorshift-ish deterministic RNG based on seed string
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function () {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatTime(hour, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  const opts = { hour: "2-digit", minute: "2-digit", hour12: true };
  return date.toLocaleTimeString("en-IN", opts);
}

export default function handler(req, res) {
  try {
    const q = req.query || {};
    // accept date param as YYYY-MM-DD or any string; fallback to today
    const dateStr = q.date || new Date().toISOString().slice(0, 10);
    // configuration: start hour, end hour (24h), slot interval minutes, default capacity
    const startHour = 9;
    const endHour = 19; // up to 7PM
    const intervalMinutes = 60; // change to 30 for half-hour slots
    const defaultCapacity = 5;

    // deterministically seed RNG from date so repeated calls give same booked numbers
    const rand = seededRandom(dateStr);

    const slots = [];
    for (let h = startHour; h < endHour; ) {
      // format slot label like "09:00 AM"
      const slotLabel = formatTime(h, 0);

      // deterministic booked count: use RNG scaled but ensure <= capacity
      const capacity = defaultCapacity;
      // make booked vary 0..capacity, but less likely to be full
      const r = rand(); // 0..1
      // skew distribution a bit: use r^2 to bias lower
      let booked = Math.floor(Math.pow(r, 1.5) * (capacity + 1));
      // Occasionally make a slot fully booked if another hash condition matches
      if (Math.floor(rand() * 10) === 0 && booked < capacity) {
        // bump up to near-full sometimes
        booked = Math.min(capacity, booked + Math.floor(rand() * 2) + 1);
      }

      // push slot object
      slots.push({
        slot: slotLabel,
        booked,
        capacity,
      });

      // advance by interval
      h += intervalMinutes / 60;
    }

    // always return JSON body (avoid 304). Also set no-store to prevent caching by CDN/browser.
    res.setHeader(
      "Cache-Control",
      "s-maxage=0, stale-while-revalidate=0, max-age=0, no-store"
    );
    return res.status(200).json({ slots });
  } catch (err) {
    console.error("slots handler error", err);
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ message: "Internal error generating slots" });
  }
}
